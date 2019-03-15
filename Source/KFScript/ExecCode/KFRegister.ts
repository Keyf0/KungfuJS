
export class KFRegister
{
    public static Create(varsize:number = 3):KFRegister
    {
        return new KFRegister(0, null, varsize);
    }

    ///销毁寄存器
    public static Destory(reg:KFRegister):boolean
    {
        if (	reg == null
            ||	reg.Top() != reg)
            return false;
        reg._Destory();
        //kfgcRelease(reg);
        return true;
    }

       ///清空寄存器的子节点
    public static Clear(reg:KFRegister):boolean
    {
        if (	reg == null
            ||	reg.Top() != reg)
        return false;
        reg._Clear();
        return true;
    }

    public static DestoryTop(reg:KFRegister)
    {
        if(reg != null)
            KFRegister.Destory(reg.Top());
    }

    public static ClearTop(reg:KFRegister):KFRegister
    {
        if (reg == null)
            return null;
        let top = reg.Top();
        KFRegister.Clear(top);
        return top;
    }

    public  constructor(paramnum:number
            , parent:KFRegister = null
            , varsize:number = 3)
    {
        this._Parent = parent;
        this._NewVarSize(paramnum,varsize);
    }

    ///将自己压入
    public Push(paranum:number, varsize:number = 3):KFRegister
    {
        if (this._Child == null)
        {
            this._Child = new KFRegister(paranum, this, varsize);
        }
        else
        {
            this._Child._NewVarSize(paranum, varsize);
        }

        return this._Child;
    }

    ///弹出父级
    public Pop():KFRegister
    {
        return this._Parent;
    }

    ///最顶端的寄存器
    public Top():KFRegister
    {
        if (this._Parent != null)
            return this._Parent.Top();
        return this;
    }

    ///最底端的寄存器
    public Bottom(): KFRegister
    {
        if (this._Child != null)
            return this._Child.Bottom();
        return this;
    }

    ///invm 是否在VM内部调用，如果invm是真则直接填充当前寄存器
    public ReturnValue(value:number, invm:boolean = false)
    {
        if (!invm || this._Parent == null)
        {
            this._NUMS[0] = value;
            return;
        }

        if (this._Parent != null)
            this._Parent._NUMS[0] = value;
    }

    ///invm 是否在VM内部调用，如果invm是真则直接填充当前寄存器
    ///ReturnValue(num1 value, bool invm = false);
    ///invm 是否在VM内部调用，如果invm是真则直接填充当前寄存器
    public ReturnValueAny(value:any, invm:boolean = false)
    {
        if (!invm || this._Parent == null)
        {
            this._OBJECTS[0] = value;
            return;
        }

        if (this._Parent != null)
            this._Parent._OBJECTS[0] = value;
    }

    public _PC:number;
    public _NUMS:Array<number> = new Array<number>();
    public _OBJECTS:Array<any> = new Array<any>();

    ///清空寄存器数据
    private _Clear()
    {
        ///删掉子集
        if (this._Child != null)
        {
            this._Child._Destory();
            //kfgcRelease(_Child);
        }

        this._Child = null;
        this._PC = 0;
    }

    private _Destory()
    {
        if (this._Child != null)
        {
            this._Child._Destory();
            //kfgcRelease(_Child);
        }

        this._PC = 0;
        this._Parent = null;
        this._Child = null;

        return true;
    }

    private _NewVarSize(paramnum:number, varsize:number)
    {
        this._NUMS.length =  varsize;
        this._OBJECTS.length = varsize;

        if (this._Parent != null)
        {
            if (paramnum > 0)
            {
                //kfCopy(&_INTS[0], &_Parent->_INTS[0], paramnum * 4);
                //kfCopy(&_FLOATS[0], &_Parent->_FLOATS[0], paramnum * 4);
                //kfCopy(&_OBJECTS[0], &_Parent->_OBJECTS[0], paramnum * sizeof(kfAny));

                for(let i:number = 0 ;i < paramnum ;i ++)
                {
                    this._NUMS[i] = this._Parent._NUMS[i];
                    this._OBJECTS[i] = this._Parent._OBJECTS[i];
                }
            }
        }
    }

    private _Parent:KFRegister;
    private _Child:KFRegister;
}