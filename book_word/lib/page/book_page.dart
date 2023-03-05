import 'package:book_word/component/book_info.dart';
import 'package:book_word/model/book_model.dart';
import 'package:book_word/util/logger.dart';
import 'package:flutter/cupertino.dart';
import '../api/book_api.dart';
import '../component/show_alert.dart';

class BookPage extends StatefulWidget {
  const BookPage({super.key});

  @override
  State<BookPage> createState() => _BookPageState();
}

class _BookPageState extends State<BookPage> {
  final logger = getLogger();
  List<BookModel> list = [];
  bool finished = false;
  String? nextCursor;

  // final ScrollController _scrollController = ScrollController();

  Future<void> loadData({bool firstTime = true}) async {
    final promise = firstTime
        ? loadBooks(limit: 20)
        : loadBooks(limit: 20, nextCursor: nextCursor);

    try {
      final res = await promise;
      nextCursor = res.nextCursor;
      setState(() {
        if (res.data != null && res.data!.isNotEmpty) {
          if (firstTime) {
            list = res.data!;
          } else {
            list.addAll(res.data!);
          }
        }
        if (res.nextCursor == null) {
          finished = true;
        }
      });
    } catch (e) {
      logger.e('load books error', e);
      showAlert(context, '提示', '加载书籍失败');
    }
  }

  @override
  void initState() {
    // _scrollController.addListener(() {
    //   if (_scrollController.position.pixels ==
    //       _scrollController.position.maxScrollExtent) {
    //     loadData(firstTime: false);
    //   }
    // });

    loadData();

    super.initState();
  }

  void registerBook(BookModel book) {
    showCupertinoModalPopup(
        context: context,
        builder: (BuildContext context) => CupertinoAlertDialog(
                title: const Text('提示'),
                content: const Text('是否订阅书籍?'),
                actions: <CupertinoDialogAction>[
                  CupertinoDialogAction(
                    onPressed: () {
                      Navigator.pop(context);
                    },
                    child: const Text('取消'),
                  ),
                  CupertinoDialogAction(
                    isDefaultAction: true,
                    onPressed: () {
                      registerBookUser(bookId: book.id);
                      Navigator.pop(context);
                    },
                    child: const Text('确定'),
                  ),
                ]));
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
        padding: const EdgeInsets.fromLTRB(20, 20, 20, 40),
        child: CustomScrollView(
          // controller: _scrollController,
          physics: const BouncingScrollPhysics(
              parent: AlwaysScrollableScrollPhysics()),
          slivers: [
            CupertinoSliverRefreshControl(
              onRefresh: () async {
                await loadData();
              },
            ),
            SliverGrid.count(
              crossAxisCount: 4,
              mainAxisSpacing: 10,
              crossAxisSpacing: 10,
              children: list
                  .map((book) => BookInfo(
                        key: Key(book.id),
                        book: book,
                        onTap: registerBook,
                      ))
                  .toList(),
            )
          ],
        ));
  }

  @override
  void dispose() {
    // _scrollController.dispose();
    super.dispose();
  }
}
