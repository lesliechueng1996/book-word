import 'package:book_word/model/book_model.dart';

class BooksRes {
  final String? nextCursor;
  final List<BookModel>? data;

  BooksRes({this.nextCursor, this.data});

  factory BooksRes.fromJson(Map<String, dynamic> json) {
    List<BookModel>? temp;
    if (json['data'] != null) {
      temp = List.from(json['data'].map((item) => BookModel.fromJson(item)));
    }
    return BooksRes(nextCursor: json['nextCursor'], data: temp);
  }
}
