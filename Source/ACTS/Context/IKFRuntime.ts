import {KFEventTable} from "../../Core/Misc/KFEventTable";
import {KFRandom} from "./KFRandom";
import {KFTimers} from "./KFTimers";
import {IKFDomain} from "./IKFDomain";
import {KFScriptSystem} from "../Script/KFScriptSystem";
import {IKFConfigs} from "./IKFConfigs";

export interface IKFRuntime
{
     root:IKFRuntime;
     parent:IKFRuntime;
     etable:KFEventTable;
     random:KFRandom;
     timers:KFTimers;
     domain:IKFDomain;

     //当前固定的时间
     fixtpf:number;

     ///实际的帧数|新文件不会更新
     realframeindex:number;

     ///当前的帧数|新文件会更新
     frameindex:number;
     ///上一帧消耗时间ms
     frametime:number;
     ///date.getTime()时间
     realytime:number;
     ///游戏运行的时间|新文件会更新
     realyplaytime:number;

     ///执行端
     // 有三个地方有影响 createOnClient = false
     // 1 domain 中 客户端创建失败
     // 2 时间线上 客户端创建块失败
     // 3 流程图上 客户端创建节点失败
     execSide:number;

     scripts:KFScriptSystem;
     configs:IKFConfigs;
}