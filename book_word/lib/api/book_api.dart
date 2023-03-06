import 'dart:io';

import 'package:dio/dio.dart';
import 'package:path_provider/path_provider.dart';

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

Future<String> downloadFileAndSave(String bookId,
    {void Function(int, int)? showDownloadProgress}) async {
  final tempDir = await getTemporaryDirectory();
  final path = tempDir.path;

  final temp = await prepareToken(true);
  final response = await dio.get(
    '/api/app/books/book/$bookId',
    onReceiveProgress: showDownloadProgress,
    options: Options(
        responseType: ResponseType.bytes,
        followRedirects: false,
        validateStatus: (status) {
          return status! < 500;
        },
        headers: {
          'Authorization': 'Bearer ${temp[0] ?? ""}',
          'User-Id': temp[1] ?? ''
        }),
  );
  File file = File('$path/$bookId');
  var raf = file.openSync(mode: FileMode.write);
  raf.writeFromSync(response.data);
  await raf.close();
  return '$path/$bookId';
}
