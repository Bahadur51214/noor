declare module "html2pdf.js" {
  interface Html2PdfWorker {
    set(options: Record<string, unknown>): Html2PdfWorker;
    from(element: HTMLElement): Html2PdfWorker;
    save(): Promise<void>;
    toPdf(): Html2PdfWorker;
    output(type: string, options?: Record<string, unknown>): Promise<unknown>;
    then(callback: () => void): Html2PdfWorker;
    catch(callback: (error: unknown) => void): Html2PdfWorker;
  }

  interface Html2PdfFactory {
    (): Html2PdfWorker;
    worker: Html2PdfWorker;
  }

  const html2pdf: Html2PdfFactory;
  export default html2pdf;
}