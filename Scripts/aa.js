/*��ȫ���룬��дһ����DOG�࣬�ܳ�ʼ����
��ȫ���룬��дһ����DOG�࣬�ܳ�ʼ�������֣���ɫ���������·�������ʹ��Щ��������ʽ����

setName(name) ����

setColor(color) ��ɫ

yelp() ��������alert('wow')

crow(num) �����ķ������������������Ĵ����� Ƶ��1��/��*/




    function DOG(name,color){
        this.name = name || ''; //��ʹû�д��Σ�Ҳ���ᱨ��
        this.color = color || '';
    }
DOG.prototype = {
    setName:function(names){
        this.name = names || this.name;
        return this;
    },
    setColor:function(colors){
        this.color = colors || this.color;//��ʹû�д��Σ��Ǿ���ԭ��������
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
dog.setName('Tom').setColor('white').crow(3);//Ҫ����ʽ������ÿ��������Ҫ�з���ֵ��

