import 'dart:io';

import 'package:book_word/exception/relogin_exception.dart';
import 'package:book_word/util/storage_util.dart';
import 'package:dio/dio.dart';
import 'package:jwt_decoder/jwt_decoder.dart';

import './logger.dart';

final log = getLogger();
const ctx = 'http://localhost:3000';
final dio = Dio(BaseOptions(baseUrl: ctx));

bool willTokenExpired(String token) {
  DateTime expirationDate =
      JwtDecoder.getExpirationDate(token).add(const Duration(minutes: -10));
  DateTime now = DateTime.now();
  return expirationDate.isBefore(now);
}

Future<List> prepareToken(bool checkToken) async {
  final auth = await StorageUtil.getCachedAuth();
  final token = auth['token'];
  if (checkToken && token == null) {
    log.w("token is null");
    throw ReloginException();
  }

  if (checkToken && willTokenExpired(token)) {
    // refresh token
    log.i("begin to refresh token");
    final refreshDio = Dio(BaseOptions(baseUrl: ctx));
    final response = await refreshDio.post('/api/app/auth/refresh-token',
        data: {'refreshToken': auth['refreshToken']},
        options: Options(headers: {'User-Id': auth['userId'] ?? ''}));

    log.i("refresh token http status: ${response.statusCode}");
    if (response.statusCode == HttpStatus.ok) {
      var jsonResponse = response.data;
      String token = jsonResponse['token'];
      String refreshToken = jsonResponse['refreshToken'];
      StorageUtil.updateCachedToken(token: token, refreshToken: refreshToken);
      log.i("refresh token success");
      return [token, auth['userId']];
    } else {
      log.w("refresh token error", response.data);
      throw ReloginException();
    }
  } else {
    return [token, auth['userId']];
  }
}

Future<void> login(String email) async {
  final response =
      await dio.post('/api/app/auth/login', data: {'email': email});
  log.i("login http status: ${response.statusCode}");
  final jsonResponse = response.data;
  if (response.statusCode == HttpStatus.ok) {
    String userId = jsonResponse['userId'];
    StorageUtil.updateCachedUserId(userId);
    log.i("send email success");
  } else {
    log.w("send email error", response.data);
    throw HttpException(jsonResponse['message']);
  }
}

Future<Map<String, dynamic>> get({
  required String uri,
  Map<String, dynamic>? queryParameters,
  bool checkToken = true,
}) async {
  final temp = await prepareToken(checkToken);

  final response = await dio.get(uri,
      queryParameters: queryParameters,
      options: Options(headers: {
        'Authorization': 'Bearer ${temp[0] ?? ""}',
        'User-Id': temp[1] ?? ''
      }));
  if (response.statusCode != HttpStatus.ok) {
    log.e({'uri': uri, 'status': response.statusCode, 'body': response.data});
    throw HttpException(response.data['message']);
  }
  return response.data;
}

Future<Map<String, dynamic>> post({
  required String uri,
  Map<String, dynamic>? queryParameters,
  Object? body,
  bool checkToken = true,
}) async {
  final temp = await prepareToken(checkToken);

  final response = await dio.post(uri,
      data: body,
      queryParameters: queryParameters,
      options: Options(headers: {
        'Authorization': 'Bearer ${temp[0] ?? ""}',
        'User-Id': temp[1] ?? ''
      }));
  if (response.statusCode != HttpStatus.ok) {
    log.e({'uri': uri, 'status': response.statusCode, 'body': response.data});
    throw HttpException(response.data['message']);
  }
  return response.data;
}
