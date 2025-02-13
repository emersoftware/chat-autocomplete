import { useEffect, useState, useRef, useCallback } from 'react';
import { useCompletion } from 'ai/react';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';

interface CompletionEditableDivProps {
  children: React.ReactNode;
  setChatInput: (input: string) => void;
  chatInput: string;
  placeholder?: string;
}

export default function CompletionEditableDiv({ 
  children, 
  setChatInput, 
  chatInput,
  placeholder = "Type your message here..." 
}: CompletionEditableDivProps) {
  const { complete, isLoading, stop } = useCompletion({
    api: '/api/completion',
    onFinish: (_, completion) => setCompletionText(completion),
    onError: (err) => {
      console.error('Completion error:', err);
      setCompletionText('');
    },
  });

  const divRef = useRef<HTMLDivElement>(null);
  const [completionText, setCompletionText] = useState('');
  const [userText, setUserText] = useState('');
  const [isComposing, setIsComposing] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Tab' && completionText) {
      e.preventDefault();
      setUserText(userText + completionText);
      setCompletionText('');
    }
    
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleCompletion(e as any);
    }

    if (e.key === 'Escape' && isLoading) {
      e.preventDefault();
      stop();
    }
  };
  
  const setEndOfUserText = useCallback(() => {
    const selection = window.getSelection();
    const range = document.createRange();
    const firstChild = divRef.current?.firstChild;
    
    if (firstChild) {
      range.selectNodeContents(firstChild);
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, []);

  const updateDivContent = useCallback(() => {
    if (!divRef.current) return;

    if (!userText && !completionText) {
      divRef.current.innerHTML = `<span class="text-gray-400">${placeholder}</span>`;
      return;
    }

    divRef.current.innerHTML = completionText 
      ? `${userText}<span class='text-black/50'>${completionText}</span>`
      : userText;

    setEndOfUserText();
    setChatInput(userText);
  }, [userText, completionText, placeholder, setChatInput, setEndOfUserText]);

  useEffect(() => {
    updateDivContent();
  }, [userText, completionText, updateDivContent]);

  useEffect(() => {
    if (!userText || userText.length <= 20 || completionText || isLoading || isComposing) {
      return;
    }

    const timeoutId = setTimeout(() => {
      complete(userText);
    }, 1000);
    
    return () => clearTimeout(timeoutId);
  }, [userText, completionText, isLoading, isComposing, complete]);

  useEffect(() => {
    if (chatInput === '') {
      setUserText('');
      setCompletionText('');
    }
  }, [chatInput]);

  const handleCompletion = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!userText.trim()) return;
    
    if (completionText) {
      setUserText(userText + completionText);
      setCompletionText('');
    } else {
      complete(userText);
    }
  };

  const handleInput = () => {
    const content = divRef.current?.textContent || '';
    if (content === placeholder) {
      setUserText('');
      setChatInput('');
      return;
    }
    setUserText(content);
    setChatInput(content);
  };

  return (
    <div className="space-y-2">
      <div
        contentEditable="plaintext-only"
        className="text-black rounded-lg p-4 mx-auto bg-white min-h-32 focus:outline-none focus:ring-2 focus:ring-primary"
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
        suppressContentEditableWarning={true}
        ref={divRef}
      />
      <div className='flex flex-row justify-center w-full space-x-2'>
        <Button 
          className="w-full"
          disabled={isLoading || !userText.trim()}
          onClick={handleCompletion}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Completing...
            </>
          ) : completionText ? (
            'Accept Completion'
          ) : (
            'Complete'
          )}
        </Button>
        {children}
      </div>
    </div>
  );
}