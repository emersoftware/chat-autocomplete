'use client';

import { useEffect, useState } from 'react';
import { useCompletion } from 'ai/react';
import { useRef } from 'react';
import { start } from 'repl';

export default function Completion() {
  const { setInput, input, complete, isLoading } = useCompletion({
    api: '/api/completion',
    onFinish(prompt, completion) {
      setCompletionText(completion);
    },
  });

  const divRef = useRef<HTMLDivElement>(null);

  const [completionText, setCompletionText] = useState('');
  const [userText, setUserText] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      setUserText(userText + completionText);
      setCompletionText('');
      if (divRef.current) {
        setEndOfContentEditable(divRef.current);
      }
    } else {
      setCompletionText('');
    }
  }

  function setEndOfContentEditable(contentEditableElement: HTMLElement) {
    let range,selection;
    if(document.createRange) { 
      range = document.createRange();
      range.selectNodeContents(contentEditableElement); 
      range.collapse(false); 
      selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }
  
  function setEndOfUserText() {
    if (divRef.current?.firstChild) {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(divRef.current.firstChild);
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }

  useEffect(() => {
    if (divRef.current) {
      if (completionText === '') {
        divRef.current.innerHTML = `${userText}`;
      } else {
        divRef.current.innerHTML = `${userText}<span class='text-black/50'>${completionText}</span>`;
      }
      setEndOfUserText();
    }
  }, [userText, completionText]);

  const handleCompletion = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (divRef.current) {
      setInput(divRef.current.innerText);
      setUserText(divRef.current.innerText);
    }
    setCompletionText('');
    complete(input);
  }

  return (
    <div className="flex flex-col space-y-2 w-full mt-2 relative">
      <div className="flex flex-row items-start">
        <div
          contentEditable="plaintext-only"
          className="text-black rounded-lg p-4 mx-auto bg-white w-2/3 min-h-32"
          onKeyDown={handleKeyDown}
          suppressContentEditableWarning={true}
          ref={divRef}
        />
      </div>

      <form onSubmit={handleCompletion} className=" text-white space-y-2">
        <span className="text-red-600">{input}</span>
        <span className="text-blue-600">{completionText}</span>
        <button disabled={isLoading} type="submit">
          Completar
        </button>
      </form>

    </div>
  );
}
