import { useEffect } from 'preact/hooks';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export function VoiceNotes({ value, onChange, placeholder }: Props) {
  const { isSupported, isListening, transcript, start, stop, reset } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      onChange(transcript);
    }
  }, [transcript, onChange]);

  const handleToggle = () => {
    if (isListening) {
      stop();
    } else {
      reset();
      start();
    }
  };

  const handleTextInput = (e: Event) => {
    const target = e.target as HTMLTextAreaElement;
    onChange(target.value);
  };

  return (
    <div class="voice-notes-wrapper">
      <textarea
        class={`voice-notes-textarea${isSupported ? '' : ' voice-notes-textarea--no-mic'}`}
        value={value}
        onInput={handleTextInput}
        placeholder={placeholder ?? 'Tasting notes...'}
        rows={3}
      />
      {isSupported && (
        <button
          type="button"
          class={`voice-mic-btn${isListening ? ' voice-mic-btn--listening' : ''}`}
          onClick={handleToggle}
          aria-label={isListening ? 'Stop dictation' : 'Start dictation'}
          title={isListening ? 'Tap to stop' : 'Tap to dictate'}
        >
          {isListening ? '\u23F9' : '\uD83C\uDF99'}
        </button>
      )}
      {isListening && <div class="voice-status">Listening... tap to stop</div>}
    </div>
  );
}
