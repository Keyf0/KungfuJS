import {IKFRuntime} from "../ACTS/Context/IKFRuntime";
import {IKFConfigs, IKFConfigs_Type} from "../ACTS/Context/IKFConfigs";
import {IKFDomain} from "../ACTS/Context/IKFDomain";
import {KFEvent, KFEventTable} from "../Core/Misc/KFEventTable";
import {KFRandom} from "../ACTS/Context/KFRandom";
import {KFScriptSystem} from "../ACTS/Script/KFScriptSystem";
import {KFTimers} from "../ACTS/Context/KFTimers";
import {KFGlobalDefines} from "../ACTS/KFACTSDefines";
import {TypeEvent} from "../Core/Misc/TypeEvent";
import {KFDomain} from "../ACTS/Context/KFDomain";
import {KFActor} from "../ACTS/Actor/KFActor";
import {KFDName} from "../KFData/Format/KFDName";
import {BlkExecSide} from "../ACTS/Context/KFBlockTarget";

export class KFiSayPlayer implements IKFRuntime
{
    public configs: IKFConfigs;
    public domain: IKFDomain;
    public etable: KFEventTable;
    public realframeindex: number;
    public frameindex: number;
    public fixtpf:number;
    public frametime: number;
    public parent: IKFRuntime;
    public random: KFRandom;
    public realytime: number;
    public realyplaytime: number;
    public execSide: number = BlkExecSide.BOTH;

    public root: IKFRuntime;
    public scripts: KFScriptSystem;
    public timers: KFTimers;

    private m_basedir:string;
    private m_path:string;
    private m_userdata:any;
    private m_root:KFActor;

    private onEnterFrame:KFEvent = new KFEvent(KFDName._Param.setString("onEnterFrame"));
    private onRenderFrame:KFEvent = new KFEvent(KFDName._Param.setString("onRenderFrame"));

    private m_lastTicks:number = 0;
    private m_startTicks:number = 0;
    private m_frameTicks:number = 0;

    public constructor(userdata:any = null)
    {
        this.m_userdata = userdata;
    }

    public Init(basedir:string)
    {
        //LOG_WARNING("%s", basedir.c_str());
        this.m_basedir = basedir;

        this.frametime = 0;
        this.frameindex = 0;
        this.realytime = 0;
        this.realframeindex = 0;
        this.fixtpf = KFGlobalDefines.FIX_TPF;

        this.configs = IKFConfigs_Type.new_default();
        this.domain = new KFDomain(this);
        ///后面有需要再实现
        this.timers = new KFTimers(this);
        this.etable = new KFEventTable();
        this.random = new KFRandom();
        this.random.Init(0);

        this.scripts = new KFScriptSystem(this);
        this.scripts.Init();
    }

    public Play(path:string)
    {
        //LOG_WARNING("%s", path.c_str());
        this.m_path = path;

        //let metaData = this.configs.GetMetaData(path,false);
        let KFBlockTargetData = {
                asseturl:path
            ,   instname:new KFDName("_root")
        };
        //kfDel(m_root);
        this.m_root = <KFActor>this.domain.CreateBlockTarget(KFBlockTargetData);
        this.m_root.ActivateBLK(KFBlockTargetData);

        this.m_lastTicks = (new Date()).getTime();
        this.m_startTicks = this.m_lastTicks;
        this.frameindex = 0;
        this.m_frameTicks = this.m_lastTicks;
    }

    public Tick(dt:number)
    {
        this.realframeindex += 1;
        let ticks = (new Date()).getTime();

        this.realytime = ticks;
        this.realyplaytime = ticks - this.m_startTicks;
        this.frametime = ticks - this.m_lastTicks; //单帧的时间
        this.m_lastTicks = ticks;

        ///累计的帧时间
        while ((ticks - this.m_frameTicks) >= this.fixtpf) {
            this.m_frameTicks += this.fixtpf;

            let currenti  = this.frameindex + 1;
            this.frameindex = currenti;

            this.etable.FireEvent(this.onEnterFrame);
            if (this.m_root)
                this.m_root.Tick(currenti);
        }
        ///渲染的帧只要可更新的频率运行
        this.etable.FireEvent(this.onRenderFrame);
    }

}