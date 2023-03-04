import AddBook from '@/components/add-book';
import Book from '@/components/book';
import Layout from '@/components/layout';
import { useToast } from '@/context/toast-context';
import BookModel from '@/model/book-model';
import { Button, Spinner } from 'flowbite-react';
import { useCallback, useState } from 'react';
import useSWRInfinite from 'swr/infinite';

interface BooksData {
  data: [BookModel];
  nextCursor: string;
}

const limit = 20;

export default function Books() {
  const { info, warn, error } = useToast();
  const [addBookLoading, setAddBookLoading] = useState(false);
  const [isLoadFinish, setIsLoadFinish] = useState(false);
  // const scrollEl = useRef<HTMLDivElement | null>(null);

  const getKey = useCallback(
    (pageIndex: number, previousPageData: BooksData) => {
      if (
        previousPageData &&
        (!previousPageData.data || previousPageData.data.length < limit)
      ) {
        setIsLoadFinish(true);
        return null;
      }
      if (pageIndex === 0) {
        return `/api/books?limit=${limit}`;
      }
      return `/api/books?limit=${limit}&nextCursor=${previousPageData.nextCursor}`;
    },
    [setIsLoadFinish]
  );

  const { data, isLoading, size, setSize } = useSWRInfinite<BooksData>(getKey);

  const uploadFiles = async (fileList: FileList | null) => {
    if (fileList == null || fileList.length === 0) {
      warn('请至少选中一个pdf文件');
      return;
    }
    setAddBookLoading(true);
    try {
      const reqList = [];
      for (let i = 0; i < fileList.length; i++) {
        const formData = new FormData();
        formData.append('file', fileList[i], fileList[i].name);
        reqList.push(
          fetch('/api/books/file', {
            method: 'POST',
            body: formData,
          })
        );
      }

      const resList = await Promise.all(reqList);
      var isSuccess = true;
      resList.forEach((res) => {
        if (res.status != 201) {
          isSuccess = false;
          error('上传文件失败');
        }
      });
      if (isSuccess) {
        info('上传成功');
      }
    } catch (e) {
      error('上传文件失败');
    } finally {
      setAddBookLoading(false);
    }
  };

  // const onContentScroll = async (e: UIEvent) => {
  //   const { scrollTop, scrollHeight, clientHeight } = scrollEl.current!;
  //   if (scrollTop + clientHeight === scrollHeight) {
  //     await loadData();
  //   }
  // };

  return (
    <Layout>
      <div
        // ref={scrollEl}
        className="overflow-y-scroll h-full"
        // onScroll={onContentScroll}
      >
        <div className="flex flex-wrap flex-row gap-4 pb-10">
          <AddBook
            loading={addBookLoading}
            onClick={async (fileList) => {
              await uploadFiles(fileList);
            }}
          />
          {data
            ?.reduce(
              (preValue: BookModel[], currentValue: BooksData) => [
                ...preValue,
                ...currentValue.data,
              ],
              [] as BookModel[]
            )
            .map((item: BookModel) => (
              <Book key={item.id} book={item} />
            ))}
        </div>
        <div className="flex justify-center">
          <Button
            disabled={isLoadFinish}
            onClick={() => {
              setSize(size + limit);
            }}
          >
            {isLoading ? (
              <div className="mr-3">
                <Spinner size="sm" light={true} />
              </div>
            ) : null}
            加载更多
          </Button>
        </div>
      </div>
    </Layout>
  );
}
