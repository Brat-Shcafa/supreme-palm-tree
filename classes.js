class Triangle {
    constructor(a, b, c){
        this.a=a;
        this.b=b;
        this.c=c;
    };
    
    Perimetr(){
        return this.a + this.b + this.c
    }
};
let tria=new Triangle(2, 4, 10);
console.log(tria.Perimetr());