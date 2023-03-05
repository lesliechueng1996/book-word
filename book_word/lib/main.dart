import 'package:book_word/model/auth_model.dart';
import 'package:book_word/util/storage_util.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
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
  void initState() {
    StorageUtil.getString("auth").then((value) {
      final authModel = Provider.of<AuthModel>(context, listen: false);
      logger.i('init auth ${authModel.isLogin}, storage: $value');
      if (value == null) {
        logger.i("shared_preferences don't store the auth info");
        authModel.signOut();
      } else {
        logger.i("shared_preferences store the auth info");
        authModel.init(value);
      }
    });
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    bool isLogin = context.watch<AuthModel>().isLogin;

    return CupertinoApp(
      title: 'Book Word',
      localizationsDelegates: const [
        DefaultMaterialLocalizations.delegate,
        DefaultCupertinoLocalizations.delegate,
        DefaultWidgetsLocalizations.delegate,
      ],
      home: CupertinoPageScaffold(
          child: SafeArea(
        child: isLogin ? MainPage() : LoginPage(),
        // child: MainPage(),
      )),
    );
  }
}
