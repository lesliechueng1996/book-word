import 'package:book_word/model/book_model.dart';
import 'package:flutter/cupertino.dart';

class BookInfo extends StatelessWidget {
  final BookModel book;
  final void Function(BookModel book) onTap;

  const BookInfo({super.key, required this.book, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        onTap(book);
      },
      child: Container(
        padding: const EdgeInsets.all(5),
        decoration: BoxDecoration(
            color: CupertinoColors.white,
            border: Border.all(color: CupertinoColors.inactiveGray, width: 5)),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [Text(book.name), const Text('假装有背景')],
        ),
      ),
    );
  }
}
