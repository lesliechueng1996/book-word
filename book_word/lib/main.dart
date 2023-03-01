import 'package:book_word/model/auth_model.dart';
import 'package:book_word/util/storage_util.dart';
import 'package:flutter/cupertino.dart';
import 'package:provider/provider.dart';
import './page/login_page.dart';
import './page/main_page.dart';
import './util/logger.dart';

void main() {
  runApp(MultiProvider(
    providers: [ChangeNotifierProvider(create: (_) => AuthModel())],
    child: const MyApp(),
  ));
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  final logger = getLogger();

  @override
  void initState() async {
    StorageUtil.getString("auth").then((value) {
      final authModel = context.watch<AuthModel>();
      if (value == null) {
        logger.i("shared_preferences don't store the auth info");
        authModel.signOut();
      } else {
        logger.i("shared_preferences store the auth info");
        authModel.inid(value);
      }
    });
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    bool isLogin = context.watch<AuthModel>().isLogin;

    return CupertinoApp(
      title: 'Book Word',
      home: isLogin ? MainPage() : const LoginPage(),
    );
  }
}
