/**//**//**//** 
**    ==================================================================================================  
**    ������CLASS_FORMATER
**    ���ܣ�JS��ʽ��  
**    ʾ����  
    ---------------------------------------------------------------------------------------------------  
  
            var xx        = new CLASS_FORMATER(code);            

            document.getElementById("display").innerHTML = xx.format(); 
  
    ---------------------------------------------------------------------------------------------------  
**    ���ߣ�ttyp  
**    �ʼ���ttyp@21cn.com  
**    ���ڣ�2006-5-21  
**    �汾��0.1
**    ����˵������������ Dron ԭ��������ĳ������ʽ��Ϊ�˸� DronFw ʹ�ã���лԭ���� ttyp��
**    ==================================================================================================  
**/  
DronFw.Class.CodeFormat = function(code){
    //��ϣ����
    function Hashtable(){
        this._hash        = new Object();
        this.add        = function(key,value){
                            if(typeof(key)!="undefined"){
                                if(this.contains(key)==false){
                                    this._hash[key]=typeof(value)=="undefined"?null:value;
                                    return true;
                                } else {
                                    return false;
                                }
                            } else {
                                return false;
                            }
                        }
        this.remove        = function(key){delete this._hash[key];}
        this.count        = function(){var i=0;for(var k in this._hash){i++;} return i;}
        this.items        = function(key){return this._hash[key];}
        this.contains    = function(key){return typeof(this._hash[key])!="undefined";}
        this.clear        = function(){for(var k in this._hash){delete this._hash[k];}}

    }

    this._caseSensitive = true;

    //�ַ���ת��Ϊ��ϣ��
    this.str2hashtable = function(key,cs){
        
        var _key    = key.split(/,/g);
        var _hash    = new Hashtable(); 
        var _cs        = true;

    
        if(typeof(cs)=="undefined"||cs==null){
            _cs = this._caseSensitive;
        } else {
            _cs = cs;
        }

        for(var i in _key){
            if(_cs){
                _hash.add(_key[i]);
            } else {
                _hash.add((_key[i]+"").toLowerCase());
            }

        }
        return _hash;
    }

    //�����Ҫת���Ĵ���
    this._codetxt        = code;

    if(typeof(syntax)=="undefined"){
        syntax = "";
    }

    this._deleteComment = false;
    //�Ƿ��Сд����
    this._caseSensitive = true;
    //���Ժ���ӿ����Ĺؼ���
    this._blockElement  = this.str2hashtable("switch,if,while,try,finally");
    //�Ǻ�������
    this._function      = this.str2hashtable("function");
    //���������ڷֺŲ�������
    this._isFor            = "for";

    this._choiceElement = this.str2hashtable("else,catch");

    this._beginBlock    = "{";
    this._endBlock      = "}";
    
    this._singleEyeElement = this.str2hashtable("var,new,return,else,delete,in,case");
    //�õ��ָ��ַ�
    this._wordDelimiters= "�� ,.?!;:\\/<>(){}[]\"'\r\n\t=+-|*%@#$^&";
    //�����ַ�
    this._quotation     = this.str2hashtable("\",'");
    //��ע���ַ�
    this._lineComment   = "//";
    //ת���ַ�
    this._escape        = "\\";
    //�������ÿ�ʼ
    this._commentOn        = "/*";
    //�������ý���
    this._commentOff    = "*/";
    //�н�����
    this._rowEnd        = ";";

    this._in            = "in";


    this.isCompress        = false;
    this.style            = 0;

    this._tabNum        = 0;


    this.format = function() {
        var codeArr        = new Array();
        var word_index    = 0;
        var htmlTxt        = new Array();

        if(this.isCompress){
            this._deleteComment = true;
        }


        //�õ��ָ��ַ�����(�ִ�)
        for (var i = 0; i < this._codetxt.length; i++) {       
            if (this._wordDelimiters.indexOf(this._codetxt.charAt(i)) == -1) {        //�Ҳ����ؼ���
                if (codeArr[word_index] == null || typeof(codeArr[word_index]) == 'undefined') {
                    codeArr[word_index] = "";
                }
                codeArr[word_index] += this._codetxt.charAt(i);
            } else {
                if (typeof(codeArr[word_index]) != 'undefined' && codeArr[word_index].length > 0)
                    word_index++;
                codeArr[word_index++] = this._codetxt.charAt(i);                
            } 
        }


        var quote_opened                = false;    //���ñ��
        var slash_star_comment_opened   = false;    //����ע�ͱ��
        var slash_slash_comment_opened  = false;    //����ע�ͱ��
        var line_num                    = 1;        //�к�
        var quote_char                  = "";       //���ñ������

        var function_opened             = false;

        var bracket_open                = false;
        var for_open                    = false;

        //���ָ��֣��ֿ���ʾ
        for (var i=0; i <=word_index; i++){            
            //�������У�����ת�������
            if(typeof(codeArr[i])=="undefined"||codeArr[i].length==0){
                continue;
            } else if(codeArr[i]==" "||codeArr[i]=="\t"){
                if(slash_slash_comment_opened||slash_star_comment_opened){
                    if(!this._deleteComment){
                        htmlTxt[htmlTxt.length] = codeArr[i];
                    }
                }
                if(quote_opened){
                        htmlTxt[htmlTxt.length] = codeArr[i];                    
                }
            } else if(codeArr[i]=="\n"){
            //��������
            } else if (codeArr[i] == "\r"){                                                                    
                slash_slash_comment_opened = false;    
                quote_opened    = false;
                line_num++;
                if(!this.isCompress){
                    htmlTxt[htmlTxt.length] = "\r\n"+ this.getIdent();    
                }
            //����function��Ĳ������
            } else if (!slash_slash_comment_opened&&!slash_star_comment_opened && !quote_opened &&this.isFunction(codeArr[i])){
                htmlTxt[htmlTxt.length] = codeArr[i]  + " ";
                function_opened = true;
            } else if (!slash_slash_comment_opened&&!slash_star_comment_opened && !quote_opened &&codeArr[i]==this._isFor){
                htmlTxt[htmlTxt.length] = codeArr[i];
                for_open = true;
            } else if (!slash_slash_comment_opened&&!slash_star_comment_opened && !quote_opened &&codeArr[i]=="("){
                bracket_open    = true;
                htmlTxt[htmlTxt.length] = codeArr[i];
            } else if (!slash_slash_comment_opened&&!slash_star_comment_opened && !quote_opened &&codeArr[i]==")"){
                bracket_open    = false;
                htmlTxt[htmlTxt.length] = codeArr[i];
            } else if (!slash_slash_comment_opened&&!slash_star_comment_opened && !quote_opened &&codeArr[i]==this._rowEnd){
                if(!this.isCompress){
                    if(!for_open){
                        if(i<word_index&&(codeArr[i+1]!="\r"&&codeArr[i+1]!="\n")){                            
                            htmlTxt[htmlTxt.length] = codeArr[i] + "\n" + this.getIdent();
                        }else{
                            htmlTxt[htmlTxt.length] = codeArr[i] + this.getIdent();
                        }
                    }else{
                        htmlTxt[htmlTxt.length] = codeArr[i];                    
                    }
                }else{
                    htmlTxt[htmlTxt.length] = codeArr[i];
                }
            } else if(!slash_slash_comment_opened&&!slash_star_comment_opened && !quote_opened &&codeArr[i]==this._beginBlock){
                for_open    = false;
                if(!this.isCompress){
                    switch(this.style){
                        case 0:
                            this._tabNum++;
                            htmlTxt[htmlTxt.length] = codeArr[i] + "\n" + this.getIdent();
                            break;
                        case 1:
                            htmlTxt[htmlTxt.length] = "\n" + this.getIdent();
                            this._tabNum++;
                            htmlTxt[htmlTxt.length] = codeArr[i] + "\n"+ this.getIdent();
                            break;
                        default:
                            this._tabNum++;
                            htmlTxt[htmlTxt.length] = codeArr[i];
                            break;
                            
                    }
                }else{
                    htmlTxt[htmlTxt.length] = codeArr[i];
                }

            } else if(!slash_slash_comment_opened&&!slash_star_comment_opened && !quote_opened &&codeArr[i]==this._endBlock){
                if(!this.isCompress){
                    this._tabNum--;
                    if(i<word_index&&codeArr[i+1]!=this._rowEnd){
                        htmlTxt[htmlTxt.length] = "\n" + this.getIdent() + codeArr[i];
                    }else{
                        htmlTxt[htmlTxt.length] = "\n" + this.getIdent() + codeArr[i];
                    }
                }else{
                    if(i<word_index&&codeArr[i+1]!=this._rowEnd){
                        htmlTxt[htmlTxt.length] = codeArr[i] + this._rowEnd;
                    }else{
                        htmlTxt[htmlTxt.length] = codeArr[i];
                    }
                }
            //�����ؼ���
            } else if (!slash_slash_comment_opened&&!slash_star_comment_opened && !quote_opened && this.isBlockElement(codeArr[i])){     
                htmlTxt[htmlTxt.length] = codeArr[i];
            //�������ö���(�����һ���ո�)
            } else if (!slash_slash_comment_opened&&!slash_star_comment_opened && !quote_opened && this.isSingleEyeElement(codeArr[i])){    
                if(codeArr[i]==this._in){
                    htmlTxt[htmlTxt.length] = " ";
                }
                htmlTxt[htmlTxt.length] = codeArr[i] + " ";
            //����˫���ţ�����ǰ����Ϊת���ַ���    
            } else if (!slash_star_comment_opened&&!slash_slash_comment_opened&&this._quotation.contains(codeArr[i])){                                                    
                if (quote_opened){
                    //����Ӧ������
                    if(quote_char==codeArr[i]){
                        htmlTxt[htmlTxt.length] = codeArr[i];                    
                        quote_opened    = false;
                        quote_char      = "";
                    } else {
                        htmlTxt[htmlTxt.length] = codeArr[i];            
                    }
                } else {
                    htmlTxt[htmlTxt.length] =  codeArr[i];
                    quote_opened    = true;
                    quote_char        = codeArr[i];
                }                    
            //����ת���ַ�
            } else if(codeArr[i] == this._escape){    
                htmlTxt[htmlTxt.length] = codeArr[i]; 
                if(i<word_index-1){
                    if(codeArr[i+1].charCodeAt(0)>=32&&codeArr[i+1].charCodeAt(0)<=127){
                        htmlTxt[htmlTxt.length] = codeArr[i+1].substr(0,1);
                        htmlTxt[htmlTxt.length] = codeArr[i+1].substr(1);
                        i=i+1;
                    }
                }            
            //��������ע�͵Ŀ�ʼ
            } else if (!slash_slash_comment_opened && !slash_star_comment_opened&&!quote_opened&&this.isStartWith(this._commentOn,codeArr,i)){                                             
                slash_star_comment_opened = true;
                if(!this._deleteComment){
                    htmlTxt[htmlTxt.length] = this._commentOn;
                }
                i = i + this.getSkipLength(this._commentOn);    
            //��������ע��
            } else if (!slash_slash_comment_opened && !slash_star_comment_opened&&!quote_opened&&this.isStartWith(this._lineComment,codeArr,i)){                                                
                slash_slash_comment_opened = true;
                if(!this._deleteComment){
                    htmlTxt[htmlTxt.length] =  this._lineComment;
                }
                i = i + this.getSkipLength(this._lineComment);    
            //�������Դ�
            } else if (!slash_slash_comment_opened && !slash_star_comment_opened&&!quote_opened&&this.isStartWith(this._ignore,codeArr,i)){                                                
                slash_slash_comment_opened = true;
                htmlTxt[htmlTxt.length] = this._ignore;
                i = i + this.getSkipLength(this._ignore);                    
            //��������ע�ͽ���    
            } else if (!quote_opened&&!slash_slash_comment_opened&&this.isStartWith(this._commentOff,codeArr,i)){                                
                if (slash_star_comment_opened) {
                    slash_star_comment_opened = false;
                    if(!this._deleteComment){
                        htmlTxt[htmlTxt.length] =  this._commentOff;
                    }
                    i = i + this.getSkipLength(this._commentOff);        
                }
            } else {
                //�������ַ�����
                if(!quote_opened){
                    //���������ע����
                    if(!slash_slash_comment_opened && !slash_star_comment_opened){    
                            htmlTxt[htmlTxt.length] = codeArr[i];                        
                    //ע����                            
                    }else{
                        if(!this._deleteComment){
                            htmlTxt[htmlTxt.length] = codeArr[i];
                        }
                    }
                }else{
                            htmlTxt[htmlTxt.length] = codeArr[i];
                }
            }
            
        }

        return htmlTxt.join("");
    }

    this.isStartWith = function(str,code,index){

        if(typeof(str)!="undefined"&&str.length>0){        
            var cc = new Array();            
            for(var i=index;i<index+str.length;i++){
                cc[cc.length] = code[i];
            }
            var c = cc.join("");
            if(this._caseSensitive){
                if(str.length>=code[index].length&&c.indexOf(str)==0){
                    return true;
                }
            }else{
                if(str.length>=code[index].length&&c.toLowerCase().indexOf(str.toLowerCase())==0){
                    return true;
                }
            }
            return false;

        } else {
            return false;
        }
    }

    this.isFunction = function(val){
        return this._function.contains(this._caseSensitive?val:val.toLowerCase());
    }
    
    this.isBlockElement = function(val) {        
        return this._blockElement.contains(this._caseSensitive?val:val.toLowerCase());
    }

    this.isChoiceElement = function(val) {        
        return this._choiceElement.contains(this._caseSensitive?val:val.toLowerCase());
    }

    this.isSingleEyeElement = function(val) {
        return this._singleEyeElement.contains(this._caseSensitive?val:val.toLowerCase());
    }

    this.isNextElement = function(from,word){
        for(var i=from;i<word.length;i++){
            if(word[i]!=" "&&word[i]!="\t"&&word[i]!="\r"&&word[i]!="\n"){                
                return this.isChoiceElement(word[i]);
            }
        }
        return false;
    }

    this.getSkipLength = function(val){    
        var count = 0;
        for(var i=0;i<val.length;i++){
            if(this._wordDelimiters.indexOf(val.charAt(i))>=0){
                count++;
            }
        }
        if(count>0){
            count=count-1;
        }
        return count;
    }

    this.getIdent=function(){
        var n = [];
        for(var i=0;i<this._tabNum;i++){
            n[n.length] = "\t";
        }
        return n.join("");
    }
}