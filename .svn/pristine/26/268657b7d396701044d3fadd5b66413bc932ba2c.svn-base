/*补全代码，编写一个简单DOG类，能初始化其
补全代码，编写一个简单DOG类，能初始化其名字，颜色，具有如下方法并能使这些方法可链式操作

setName(name) 名字

setColor(color) 颜色

yelp() 发出叫声alert('wow')

crow(num) 连续的发出叫声（发出叫声的次数） 频率1次/秒*/




    function DOG(name,color){
        this.name = name || ''; //即使没有传参，也不会报错
        this.color = color || '';
    }
DOG.prototype = {
    setName:function(names){
        this.name = names || this.name;
        return this;
    },
    setColor:function(colors){
        this.color = colors || this.color;//即使没有传参，那就是原来的名字
        return this;
    },
    yelp:function(){
        alert('wow');
    },
    crow:function(num){
        this.num = num;
        if(typeof this.num != 'number' || num === 0 ){
            throw new Error("ss");
            return !1;
        }
        for(var i = 1;i<=num;i++){
            setTimeout(this.yelp,(i+1)*1000);
        }
        return this;
    }
}
var dog = new DOG('jack','black');
dog.setName('Tom').setColor('white').crow(3);//要想链式操作，每个方法都要有返回值！

