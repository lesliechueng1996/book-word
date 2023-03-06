import 'dart:io';

import 'package:book_word/api/book_api.dart';
import 'package:book_word/component/book_info.dart';
import 'package:book_word/model/book_model.dart';
import 'package:book_word/page/read_book.dart';
import 'package:book_word/util/logger.dart';
import 'package:flutter/cupertino.dart';
import 'package:path_provider/path_provider.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  List<BookModel> _books = [];
  final logger = getLogger();

  @override
  void initState() {
    myBooks().then((value) {
      print(value);
      setState(() {
        _books = value;
      });
    });
    super.initState();
  }

  void readBook(BookModel book) {
    getTemporaryDirectory().then((tempDir) {
      final existingFile = File('${tempDir.path}/${book.id}');
      logger.i(
          'file path: ${existingFile.path}, existing: ${existingFile.existsSync()}');
      if (existingFile.existsSync()) {
        logger.i('file exist');
        Navigator.push(
            context,
            CupertinoPageRoute(
                builder: (context) => ReadBookPage(
                      bookId: book.id,
                      filePath: existingFile.path,
                    )));
        return;
      }

      logger.i('start download file');
      showCupertinoDialog(
          context: context,
          builder: (BuildContext context) {
            downloadFileAndSave(book.id).then((filePath) {
              logger.i('download file success, file path: $filePath');
              Navigator.pop(context);

              Navigator.push(
                  context,
                  CupertinoPageRoute(
                      builder: (context) => ReadBookPage(
                            bookId: book.id,
                            filePath: filePath,
                          )));
            });

            return const CupertinoAlertDialog(
              title: Text('下载中...'),
              content: CupertinoActivityIndicator(
                radius: 20.0,
              ),
            );
          });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 20, 20, 50),
      child: Column(
        children: [
          Container(
            height: 300,
            decoration: BoxDecoration(
                color: CupertinoColors.white,
                border: Border.all(width: 5, color: CupertinoColors.black),
                borderRadius: BorderRadius.circular(10)),
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemBuilder: (BuildContext context, index) => BookInfo(
                  key: Key(_books[index].id),
                  book: _books[index],
                  onTap: readBook),
              itemCount: _books.length,
            ),
          ),
        ],
      ),
    );
  }
}
