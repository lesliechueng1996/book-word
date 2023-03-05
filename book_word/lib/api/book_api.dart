import '../model/book_model.dart';
import '../model/response/books_res.dart';
import '../util/http_util.dart';

Future<BooksRes> loadBooks({required int limit, String? nextCursor}) async {
  Map<String, dynamic> queryParameters = {'limit': limit};
  if (nextCursor != null) {
    queryParameters['nextCursor'] = nextCursor;
  }
  var result =
      await get(uri: '/api/app/books', queryParameters: queryParameters);
  BooksRes booksRes = BooksRes.fromJson(result);
  return booksRes;
}

Future<void> registerBookUser({required String bookId}) async {
  await post(uri: '/api/app/books/book/$bookId/user');
}

Future<List<BookModel>> myBooks() async {
  final result = await get(uri: '/api/app/books/user');
  List<BookModel> books =
      List.from(result['books'].map((item) => BookModel.fromJson(item)));
  return books;
}
