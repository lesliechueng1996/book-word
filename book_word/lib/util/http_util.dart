import 'dart:convert' as convert;
import 'dart:io';

import 'package:book_word/exception/relogin_exception.dart';
import 'package:book_word/util/storage_util.dart';
import 'package:http/http.dart' as http;
import 'package:jwt_decoder/jwt_decoder.dart';

import './logger.dart';

const ctx = 'localhost:3000';

class HttpUtil {
  final log = getLogger();

  Future<String> get({
    required String uri,
    Map<String, dynamic>? queryParameters,
  }) async {
    final temp = await prepareToken();
    Uri url = Uri.http(ctx, uri, queryParameters);

    final response = await http.get(url, headers: {
      'Authorization': 'Bearer ${temp[0] ?? ""}',
      'User-Id': temp[1] ?? ''
    });
    if (response.statusCode != HttpStatus.ok) {
      log.e({'status': response.statusCode, 'body': response.body});
      throw HttpException(response.body);
    }
    return response.body;
  }

  Future<String> post({
    required String uri,
    Map<String, dynamic>? queryParameters,
    Object? body,
  }) async {
    final temp = await prepareToken();
    Uri url = Uri.http(ctx, uri, queryParameters);

    final response = await http.post(url,
        headers: {
          'Authorization': 'Bearer ${temp[0] ?? ""}',
          'User-Id': temp[1] ?? ''
        },
        body: body);
    if (response.statusCode != HttpStatus.ok) {
      log.e({'status': response.statusCode, 'body': response.body});
      throw HttpException(response.body);
    }
    return response.body;
  }

  Future<List> prepareToken() async {
    final auth = await StorageUtil.getCachedAuth();
    final token = auth['token'];
    if (token == null) {
      log.w("token is null");
      throw ReloginException();
    }

    if (willTokenExpired(token)) {
      // refresh token
      log.i("begin to refresh token");
      final refreshTokenUrl = Uri.http(ctx, '/api/app/auth/refresh-token');
      final response = await http.post(refreshTokenUrl, headers: {
        'User-Id': auth['userId'] ?? '',
      }, body: {
        'refreshToken': auth['refreshToken']
      });
      log.i("refresh token http status: ${response.statusCode}");
      if (response.statusCode == HttpStatus.ok) {
        var jsonResponse =
            convert.jsonDecode(response.body) as Map<String, dynamic>;
        String token = jsonResponse['token'];
        String refreshToken = jsonResponse['refreshToken'];
        StorageUtil.updateCachedToken(token: token, refreshToken: refreshToken);
        log.i("refresh token success");
        return [token, auth['userId']];
      } else {
        log.w("refresh token error", response.body);
        throw ReloginException();
      }
    } else {
      return [token, auth['userId']];
    }
  }

  bool willTokenExpired(String token) {
    DateTime expirationDate =
        JwtDecoder.getExpirationDate(token).add(const Duration(minutes: -10));
    DateTime now = DateTime.now();
    return expirationDate.isBefore(now);
  }
}
