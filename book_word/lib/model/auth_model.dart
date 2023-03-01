import 'dart:convert' as convert;

import 'package:flutter/foundation.dart';

class AuthModel extends ChangeNotifier {
  bool _loginFlag = false;

  bool get isLogin => _loginFlag;

  void inid(String jsonStr) {
    Map<String, dynamic> map = convert.jsonDecode(jsonStr);
    _loginFlag = map['loginFlag'];
    notifyListeners();
  }

  void signIn() {
    _loginFlag = true;
    notifyListeners();
  }

  void signOut() {
    _loginFlag = false;
    notifyListeners();
  }
}
