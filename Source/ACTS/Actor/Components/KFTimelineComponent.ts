import {KFComponentBase} from "./KFComponentBase";
import {IKFTimelineEventListener} from "../../Timeline/IKFTimelineProc";
import {KFTimeline} from "../../Timeline/KFTimeline";
import {Disposable} from "../../../Core/Misc/TypeEvent";
import {IKFTimelineRenderer} from "../../Timeline/IKFTimelineRenderer";
import {IKFMeta} from "../../../Core/Meta/KFMetaManager";

export class KFTimelineComponent extends KFComponentBase
{
    public static Meta:IKFMeta
        = new IKFMeta("KFTimelineComponent");

    private m_cfg:any;
    private m_timeline:KFTimeline;
    private m_onbeginplay:Disposable;

    private playing:boolean;
    private stateid:number = -1;

    public constructor(target:any)
    {
        super(target, KFTimelineComponent.Meta.type);
        this.m_timeline = new KFTimeline(target);
    }

    public ReleaseComponent():void
    {
        this.m_timeline.Release();
    }

    public ResetComponent():void
    {
        let state = this.m_timeline.currstate;
        let currentFrameIndex = this.m_timeline.currframeindex;

        if (state && currentFrameIndex >= state.length)
        {
            currentFrameIndex = state.length - 1;
        }

        let tmp:number = this.stateid;
        this.stateid = -1;
        this.m_timeline.Reset();
        let tconfig = this.runtime.configs.GetTimelineConfig(this.targetObject.metadata.asseturl);
        this.m_cfg = tconfig;

        this.m_timeline.SetConfig(tconfig);

        this.PlayFrame(tmp, currentFrameIndex);
    }

    public ActivateComponent():void
    {
        this.m_cfg = this.runtime.configs.GetTimelineConfig(this.targetObject.metadata.asseturl);
        this.m_timeline.SetConfig(this.m_cfg);
    }

    public DeactiveComponent():void
    {
        if(this.m_onbeginplay != null)
        {
            this.m_onbeginplay.dispose();
            this.m_onbeginplay = null;
        }

        this.stateid = 0;
        this.playing = true;
        this.m_cfg = null;
    }

    public EnterFrame(frameindex:number):void
    {
        this.m_timeline.Tick(frameindex);
    }

    public Play(stateid:number, force:boolean = false)
    {
        if (!force)
        {
            if (this.stateid == stateid) return;
        }
        this.playing = true;
        this.stateid = stateid;
        //this.ClearKeyFrame();
        this.m_timeline.Play(stateid, 0);
    }

    //public ClearKeyFrame():void{}

    public PlayFrame(stateid:number, startFrameIndex:number)
    {
        this.playing = true;
        this.stateid = stateid;
        this.m_timeline.Play(stateid, startFrameIndex);
    }

    public PlayTime(stateid:number, startTimeNormalized:number)
    {
        this.playing = true;
        this.stateid = stateid;
        this.m_timeline.Play1(stateid, startTimeNormalized);
    }

    public PlayOnly(stateid:number)
    {
        this.m_timeline.Play(stateid, 0);
    }

    public PlayRepeatFrame(startFrameIndex:number = 0)
    {

        this.m_timeline.Play(this.stateid, startFrameIndex);
    }

    public PlayRepeatTime(startTimeNormalized:number = 0.0)
    {
        this.m_timeline.Play1(this.stateid, startTimeNormalized);
    }

    //public Stop() {}

    public StopAt(stopFrameIndex:number = 0)
    {
        this.m_timeline.Play(this.stateid, stopFrameIndex);
        this.playing = false;
    }

    public StopAtTime(stopTimeNormalized:number = 0.0)
    {
        this.m_timeline.Play1(this.stateid, stopTimeNormalized);
        this.playing = false;
    }


    public SetTimelineEventListener(listener:IKFTimelineEventListener)
    {
        this.m_timeline.listener = listener;
    }

    public HasState(stateid:number):boolean
    {
        return this.m_timeline.HasState(stateid);
    }
}