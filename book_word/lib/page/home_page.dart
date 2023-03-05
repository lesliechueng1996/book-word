import 'package:book_word/api/book_api.dart';
import 'package:book_word/component/book_info.dart';
import 'package:book_word/model/book_model.dart';
import 'package:book_word/page/read_book.dart';
import 'package:flutter/cupertino.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  List<BookModel> _books = [];

  @override
  void initState() {
    myBooks().then((value) {
      setState(() {
        _books = value;
      });
    });
    super.initState();
  }

  void readBook(BookModel book) {
    // Navigator.push(
    //     context,
    //     CupertinoPageRoute(
    //         builder: (BuildContext context) => ReadBookPage(bookId: book.id)));
    Navigator.of(context).push(CupertinoPageRoute(
        builder: (BuildContext context) => ReadBookPage(bookId: book.id)));
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.all(20),
      child: Column(
        children: [
          Container(
            decoration: BoxDecoration(
                color: CupertinoColors.white,
                border: Border.all(width: 5, color: CupertinoColors.black),
                borderRadius: BorderRadius.circular(10)),
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemBuilder: (BuildContext context, index) =>
                  BookInfo(book: _books[index], onTap: readBook),
              itemCount: _books.length,
            ),
          )
        ],
      ),
    );
  }
}
