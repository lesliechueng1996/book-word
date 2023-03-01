import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _emailTextController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        children: [
          CupertinoTextFormFieldRow(
            controller: _emailTextController,
            prefix: const Icon(Icons.email_rounded),
          ),
          CupertinoButton(
            child: const Text('发送验证码'),
            onPressed: () {},
          )
        ],
      ),
    );
  }

  @override
  void dispose() {
    _emailTextController.dispose();
    super.dispose();
  }
}
