import { Provider } from 'jotai';

export default function Providers({ children }: { children: any }) {
  return <Provider>{children}</Provider>;
}
