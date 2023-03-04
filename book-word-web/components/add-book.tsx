import { PlusIcon } from '@heroicons/react/24/solid';
import { Spinner } from 'flowbite-react';
import { useRef } from 'react';

export default function AddBook({
  loading,
  onClick,
}: {
  loading: boolean;
  onClick?: (fileList: FileList | null) => Promise<void> | void;
}) {
  const inputEl = useRef<HTMLInputElement>(null);

  const className = `w-40 h-48 border-dashed border-4 border-gray-500 flex justify-center items-center ${
    loading ? 'cursor-wait' : 'cursor-pointer'
  }`;

  return (
    <div
      className={className}
      onClick={() => {
        !loading && inputEl.current?.click();
      }}
    >
      <input
        type="file"
        className="hidden"
        multiple
        accept="application/pdf"
        ref={inputEl}
        onChange={async () => {
          onClick && (await onClick(inputEl.current!.files));
          inputEl.current!.value = '';
        }}
      />
      <div className="w-20 h-20 text-center leading-[5rem]">
        {loading ? (
          <Spinner size="xl" aria-label="Loading" />
        ) : (
          <PlusIcon className="text-gray-500" />
        )}
      </div>
    </div>
  );
}
