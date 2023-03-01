import 'dart:math';

import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert' as convert;

class StorageUtil {
  static Future<void> setString(String key, String value) async {
    SharedPreferences sp = await SharedPreferences.getInstance();
    sp.setString(key, value);
  }

  static Future<String?> getString(String key) async {
    SharedPreferences sp = await SharedPreferences.getInstance();
    return sp.getString(key);
  }

  static Future<void> remove(String key) async {
    SharedPreferences sp = await SharedPreferences.getInstance();
    sp.remove(key);
  }

  static Future<void> clear(String key) async {
    SharedPreferences sp = await SharedPreferences.getInstance();
    sp.clear();
  }

  static Future<Map<String, dynamic>> getCachedAuth() async {
    String? jsonStr = await getString("auth");
    if (jsonStr == null) {
      return {};
    }
    return convert.jsonDecode(jsonStr);
  }

  static Future<void> updateCachedToken(
      {required String token, required String refreshToken}) async {
    Map<String, dynamic> map = await getCachedAuth();
    map['token'] = token;
    map['refreshToken'] = refreshToken;
    StorageUtil.setString("auth", convert.jsonEncode(map));
  }
}
