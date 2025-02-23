import { RefObject } from 'react';
export declare const useCaptureElement: () => {
    generateImage: (ref: RefObject<HTMLElement>, fileName?: string, excludeSelector?: string | null) => Promise<void>;
};
