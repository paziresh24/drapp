import NextDocument, { Html, Head, Main, NextScript } from 'next/document';
class Document extends NextDocument {
    static async getInitialProps(ctx: any) {
        return await NextDocument.getInitialProps(ctx);
    }
    render() {
        return (
            <Html dir="rtl" lang="fa-IR">
                <Head />
                <body className="font-sans">
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
export default Document;
