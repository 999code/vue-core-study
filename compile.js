class Compile{
    constructor(el,vm){
        this.$vm=vm;
        this.$el=document.querySelector(el)
        if(this.$el){
            this.compile(this.$el)
        }
    }
    compile(el){
        const childNodes=el.childNodes
        Array.from(childNodes).forEach(node=>{
            if(this.isElement(node)){
                this.compileElement(node)
            }else if(this.isText(node)){
                debugger
                this.compileText(node)
            }
            if(node.childNodes && node.childNodes.length>0){
                this.compile(node)
            }
        })
    }
    isElement(node){
        return node.nodeType===1
    }
    isText(node){
        return node.nodeType===3 && /\{\{(.*)\}\}/.test(node.textContent)
    }
    compileElement(node){
        const nodeAttrs=node.attributes
        Array.from(nodeAttrs).forEach(attr=>{
            const attrName=attr.name
            const exp=attr.value
            if(this.isDirective(attrName)){
                const dir=attrName.subString(2)
                this[dir] && this[dir](node,exp)
            }else if(this.isEvent(attrName)){
                const dir=attrName.subString(1)
                this.eventHandler(node,exp,dir)
            }
        })
    }
    
    compileText(node){
        node.textContent=this.$vm[RegExp.$1]
        this.update(node,RegExp.$1,'text')
    }

    eventHandler(node,exp,dir){
        const fn=this.$vm.$options && this.$vm.$options.methods[exp]
        node.addEventListener(dir,fn.bind(this.$vm))
    }

    isEvent(name){
        return name.indexOf('@')
    }

    isDirective(name){
        return name.indexOf('v-')===0
    }

    model(node,exp){
        // 双向绑定 data的改变要能够作用于表单 表单值的改变也要能作用于data
        this.update(node,exp,'model')
        node.addEventListener('input',e=>{
            this.$vm[exp]=e.target.value
        })
    }

    text(node,exp){
        this.update(node,exp,'text')
    }
    html(node,exp){
        this.update(node,exp,'html')
    }
       
    update(node,exp,dir){
        const fn=this[dir+'Updater']
        fn && fn(node, this.$vm[exp])
        new Watcher(this.$vm,exp,function(val){
            fn && fn(node,val)
        })
    }

    modelUpdater(node,val){
        node.value=val
    }

    textUpdater(node,val){
        node.textContent=val
    }
    htmlUpdater(node,val){
        node.innerHTML=val
    }
}