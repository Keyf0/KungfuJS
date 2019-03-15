

export interface IKFConfigs
{

    Init(basedir:string):void;
    GetMetaData(asseturl:string, bFullpath:boolean):any;//KFMetaData
    GetTimelineConfig(path:string, bFullpath:boolean):any; //KFTimelineConfig
    GetGraphConfig(path:string, bFullpath:boolean):any;///KFGraphConfig
    GetActorConfig(path:string, bFullpath:boolean):any;///KFActorConfig
    GetAnyConfig(path:string):any;


    SetTimelineConfig(path:string, KFTimelineConfig:any):void;
    SetGraphConfig(path:string, KFGraphConfig:any):void;

    basedir():string;
}