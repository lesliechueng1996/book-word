import 'dart:io';

import 'package:book_word/util/storage_util.dart';

import '../util/http_util.dart';

Future<void> validateCode(String code) async {
  final res = await post(
      uri: '/api/app/auth/code', body: {'code': code}, checkToken: false);
  StorageUtil.updateCachedToken(
      token: res['token'], refreshToken: res['refreshToken']);
}
