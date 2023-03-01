class HttpException implements Exception {
  late String _msg;
  HttpException(String msg) {
    _msg = msg;
  }
  String get msg => _msg;
}
