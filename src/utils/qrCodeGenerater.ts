import  QRCode  from "qrcode";

export const generateQRCode = async(url: string): Promise<string |  null > =>{
    try{
        const qrCodeDataUrl = await QRCode.toDataURL(url , {
            width: 300,
            margin:2,
            color:{
                dark: '#000000',
        light: '#FFFFFF',
            }
        })
        return  qrCodeDataUrl
    }
    catch(error:any){
        console.error('QR Code generation failed:', error);
        return null;
    }
}