import 'package:book_word/page/book_page.dart';
import 'package:book_word/page/home_page.dart';
import 'package:book_word/page/my_page.dart';
import 'package:book_word/page/word_page.dart';
import 'package:flutter/cupertino.dart';

class MainPage extends StatefulWidget {
  const MainPage({super.key});

  @override
  State<MainPage> createState() => _MainPageState();
}

class _MainPageState extends State<MainPage> {
  @override
  Widget build(BuildContext context) {
    return CupertinoTabScaffold(
        tabBar: CupertinoTabBar(
          items: const [
            BottomNavigationBarItem(
                icon: Icon(CupertinoIcons.home), label: '首页'),
            BottomNavigationBarItem(
                icon: Icon(CupertinoIcons.book), label: '书籍'),
            BottomNavigationBarItem(
                icon: Icon(CupertinoIcons.list_bullet), label: '单词'),
            BottomNavigationBarItem(
                icon: Icon(CupertinoIcons.person), label: '我的')
          ],
        ),
        tabBuilder: (BuildContext context, int index) {
          return CupertinoTabView(builder: (BuildContext context) {
            Widget widget = Container();
            switch (index) {
              case 0:
                widget = const HomePage();
                break;
              case 1:
                widget = const BookPage();
                break;
              case 2:
                widget = const WordPage();
                break;
              case 3:
                widget = const MyPage();
                break;
              default:
                break;
            }
            return widget;
          });
        });
  }
}
