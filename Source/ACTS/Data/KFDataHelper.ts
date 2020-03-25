import {KFDTable} from "../../KFData/Format/KFDTable";
import {GSExpressionScript, GSPlayStateScript, GSRemoteScript} from "../Script/Global/GlobalScripts";
import {ScriptMeta} from "../Script/KFScriptFactory";
import {KFExpression} from "../Script/Global/KFExpression";
import {KFScriptData} from "../../KFScript/KFScriptDef";

export class KFDataHelper
{
    public static Meta2MapValue(meta:any) : {[key:string]:string;}
    {
        let mapvalues:{[key:string]:string;} = {};
        if(meta && meta.fields && meta.fields.items)
        {
            let items = meta.fields.items;
            for(let i = 0 ; i < items.length; i ++)
            {
                let itemobj = items[i];
                mapvalues[itemobj.key] = itemobj.value;
            }
        }
        return mapvalues;
    }

    public static InitSD(SMetas:ScriptMeta[],kfdtable:KFDTable){

        for(let i = 0;i < SMetas.length;i ++)
        {
            let meta:ScriptMeta = SMetas[i];
            let kfd = kfdtable.get_kfddata(meta.name.toString());
            if (kfd) {
                kfd.__init__ = {func: meta.DataInit};
            }
            KFScriptData.RFS[meta.name.value] = meta.RS;
        }
    }

    public static InitAfterKFDTable(kfdtable:KFDTable)
    {
        ///注册所有脚本数据的初始化
        KFDataHelper.InitSD([
            GSPlayStateScript.Meta
            , GSExpressionScript.Meta
            ,GSRemoteScript.Meta]
            ,kfdtable);

        let KFExpressionKFD = kfdtable.get_kfddata("KFExpression");
        KFExpressionKFD.__new__ = function()
        {
            return new KFExpression();
        }

        ///默认初始化KFFrameData
        let KFFrameDataKFD = kfdtable.get_kfddata("KFFrameData");
        KFFrameDataKFD.__init__ = {func:function(data, kfd, kfdtb)
            {
                data.index = 0;
                data.once = false;
                data.startPC = 0;
                data.varsize = 3;
                data.paramsize = 0;
        }};


    }
}