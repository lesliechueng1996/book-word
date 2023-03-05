import 'dart:convert';
import 'dart:io';

import 'package:book_word/api/auth_api.dart';
import 'package:book_word/component/show_alert.dart';
import 'package:book_word/model/auth_model.dart';
import 'package:book_word/util/storage_util.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:pin_code_fields/pin_code_fields.dart';
import 'package:provider/provider.dart';

import '../util/logger.dart';
import '../util/http_util.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _emailTextController = TextEditingController();
  final _pinputController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  bool _showPinput = false;
  String _email = '';
  final log = getLogger();

  void sendEmail({bool reSend = false}) async {
    if (reSend) {
      log.i('login email: $_email');
      try {
        await login(_email);
      } on HttpException catch (e) {
        showAlert(context, '发送失败', e.message);
      } catch (e) {
        log.e('login error', e);
        showAlert(context, '提示', '登录失败');
      }
    } else {
      if (_formKey.currentState!.validate()) {
        log.i('login email: ${_emailTextController.text}');
        try {
          await login(_emailTextController.text);
          _email = _emailTextController.text;
          setState(() {
            _showPinput = true;
          });
        } on HttpException catch (e) {
          showAlert(context, '发送失败', e.message);
        } catch (e) {
          log.e('login error', e);
          showAlert(context, '提示', '登录失败');
        }
      }
    }
  }

  @override
  void initState() {
    StorageUtil.getString("email")
        .then((value) => {_emailTextController.text = value ?? ''});
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Form(
          key: _formKey,
          child: _showPinput ? pinputWidget() : inputEmailWidget()),
    );
  }

  @override
  void dispose() {
    _emailTextController.dispose();
    _pinputController.dispose();
    super.dispose();
  }

  Widget inputEmailWidget() => Column(
        children: [
          Expanded(
            flex: 1,
            child: Container(),
          ),
          Container(
            margin: const EdgeInsets.only(bottom: 20),
            decoration: BoxDecoration(
                border: Border.all(color: Colors.lightBlue),
                borderRadius: BorderRadius.circular(15)),
            child: CupertinoTextFormFieldRow(
              controller: _emailTextController,
              prefix: const Icon(Icons.email_rounded),
              placeholder: '请输入邮箱',
              validator: (String? value) {
                final regExp =
                    RegExp(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$');
                return value != null && regExp.hasMatch(value)
                    ? null
                    : '请输入正确的邮箱地址';
              },
            ),
          ),
          CupertinoButton(
            onPressed: () {
              sendEmail();
            },
            child: const Text('发送验证码'),
          ),
          Expanded(
            flex: 2,
            child: Container(),
          )
        ],
      );

  Widget pinputWidget() => Column(
        children: [
          Expanded(
            flex: 1,
            child: Container(),
          ),
          Container(
              margin: const EdgeInsets.only(bottom: 20),
              padding: const EdgeInsets.only(left: 20, right: 20),
              child: Material(
                  child: PinCodeTextField(
                appContext: context,
                backgroundColor: Colors.white,
                length: 6,
                animationType: AnimationType.fade,
                pinTheme: PinTheme(
                  shape: PinCodeFieldShape.box,
                  borderRadius: BorderRadius.circular(5),
                  fieldHeight: 60,
                  fieldWidth: 50,
                  activeFillColor: Colors.white,
                  inactiveFillColor: Colors.white,
                  inactiveColor: Colors.blueAccent,
                ),
                controller: _pinputController,
                animationDuration: const Duration(milliseconds: 300),
                enableActiveFill: true,
                onCompleted: (v) async {
                  try {
                    await validateCode(v);
                    if (mounted) {
                      var authModel =
                          Provider.of<AuthModel>(context, listen: false);
                      authModel.signIn();
                    }
                  } on HttpException catch (e) {
                    showAlert(context, '提示', e.message);
                  }
                },
                onChanged: (value) {},
                beforeTextPaste: (text) {
                  return true;
                },
              ))),
          CupertinoButton(
            onPressed: () {
              _pinputController.clear;
              sendEmail(reSend: true);
            },
            child: const Text('重新发送'),
          ),
          Expanded(
            flex: 2,
            child: Container(),
          )
        ],
      );
}
