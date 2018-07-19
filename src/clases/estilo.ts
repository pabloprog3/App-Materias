export class Estilo{

    private estiloBtn:string;
    private estiloBtn1:string;
    private estiloFondo:string;
    private estilotitulo:string;
    private correo:string;

  
    constructor(){
        this.correo = '';
        this.estiloBtn = '';
        this.estiloBtn1 = '';
        this.estiloFondo = '';
        this.estilotitulo = '';
    }

    public getCorreo(){
      return this.correo;
    }

    public getEstiloBtn(){
        return this.estiloBtn;
    }

    public setEstiloBtn1(estilo:string):void{
        this.estiloBtn1 = estilo;
    }

    public getEstiloFondo(){
        return this.estiloFondo;
    }


    public setCorreo(mail:string):void{
      this.correo = mail;
    }

    public setEstiloBtn(estilo:string):void{
        this.estiloBtn = estilo;
    }

    public setEstiloFondo(estilo:string):void{
        this.estiloFondo = estilo;
    }

    public setEstiloTitulo(estilo:string):void{
        this.estilotitulo = estilo;
    }

  
  
  
  }
  