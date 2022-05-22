function defineReactive(obj,key,val){

    observe(val)
    const dep=new Dep()
    Object.defineProperty(obj,key,{
        get(){
            // 添加依赖
            Dep.target && dep.addDep(Dep.target)
            return val
        },
        set(newVal){
            if(newVal!==val){
                // 依赖监听
                observe(newVal)
                val=newVal
                // 发布订阅模式  通知更新
                dep.notify()
            }
        }
    })

}



function observe(obj){
    if(typeof obj !== 'object' || obj ===null){
        return obj
    }

    new Observer(obj)
}

class Observer{
    constructor(val){
        this.value=val
        if(typeof val === 'object'){
            this.walk(val)
        }
    }
    walk(obj){
        Object.keys(obj).forEach((key)=>{
            defineReactive(obj,key,obj[key])
        })
    }
}



class Watcher{
    constructor(vm,exp,updateFn){
        this.vm=vm
        this.exp=exp
        this.updateFn=updateFn
        Dep.target=this
        this.vm[exp]
        Dep.target=null
    }

    update(){
        // 发布订阅模式
        // watcher更新执行update
        this.updateFn.call(this.vm,this.vm[exp])
    }

}

// Dep保存Watcher
class Dep{
    constructor(){
        this.deps=[]
    }
    addDep(val){
        this.deps.push(val)
    }
    notify(){
        this.deps.forEach((dep)=>dep.update())
    }
}

function proxy(vm,sourceKey){
    Object.keys(vm[sourceKey]).forEach((key)=>{
        Object.defineProperty(vm,key,{
            get(){
                return vm[sourceKey][key]
            },
            set(newVal){
                vm[sourceKey][key]=newVal
            }
        })
    })
}

class Vue {
    constructor(options){
        this.$options=options
        this.$data=options.data
        observe(this.$data)
        proxy(this,'$data')
        new Compile(options.el,this)

    }
}

