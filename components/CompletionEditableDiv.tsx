import { use, useEffect, useState } from 'react';
import { useCompletion } from 'ai/react';
import { useRef } from 'react';
import { Button } from './ui/button';

export default function CompletionEditableDiv({ children, setChatInput, chatInput }: { children: React.ReactNode; setChatInput: (input: string) => void; chatInput: string }) {
  const { complete, isLoading } = useCompletion({
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
    } 
    setCompletionText('');
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
      setChatInput(divRef.current?.firstChild?.textContent || '');
    }
  }, [userText, completionText]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if(userText.length > 20 && completionText === ''){
        complete(userText);
      }
    }, 4444);
    
    return () => clearInterval(intervalId);

  }, [userText, completionText]);

  useEffect(() => {
    if(divRef.current && chatInput === '') {
      divRef.current.innerHTML = '';
    }
  }, [chatInput]);

  const handleCompletion = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    //setCompletionText('');
    complete(userText);
  }

  return (
    <div className="space-y-2">
      <div
        contentEditable="plaintext-only"
        className="text-black rounded-lg p-4 mx-auto bg-white min-h-32"
        onKeyDown={handleKeyDown}
        onInput={() => {
          setChatInput(divRef.current?.firstChild?.textContent || '')
          setUserText(divRef.current?.firstChild?.textContent || '');
        }}
        suppressContentEditableWarning={true}
        ref={divRef}
      />
      <div className='flex flex-row justify-center w-full space-x-2'>
        <Button className="w-full" disabled={isLoading} onClick={handleCompletion}>
          Completar
        </Button>
        {children}
      </div>
    </div>
  );
}