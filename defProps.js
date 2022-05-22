const originalProto=Array.prototype
const arrayProto=Object.create(originalProto)
// 拷贝原型
['push','pop','shift','unshift','splice','reverse','sort'].forEach(method=>{
    arrayProto[method]=function(){
        originalProto[method].apply(this,arguments)
        notifyUpdate()
    }
})

function observe(obj){
    if(typeof obj !=='object' || obj===null) return obj
    if(Array.isArray(obj)){
        Object.setPrototypeOf(obj,arrayProto)
    }else{
        Object.keys(obj).forEach(key=>{
            defineReactive(obj,key,obj[key])
        })
    }
}


function defineReactive(obj,key,val){
    observe(val)
    Object.defineProperty(obj,key,{
        get(){
            return val
        },
        set(newVal){
            if(newVal!==val){
                observe(newVal)
                val=newVal
                notifyUpdate()
            }
        }
    })
}

function notifyUpdate(){
    console.log('页面更新')
}



