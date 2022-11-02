export class TransactionDetail{
    private reason: string
    constructor(reason: string){
        this.reason = reason
    }

    toString(){
        return JSON.stringify(this)
    }
}

export class GameTransactionDetail extends TransactionDetail{
    private gameHistoryId: string

    constructor(reason: string, gameHistoryId: string){
        super(reason)
        this.gameHistoryId = gameHistoryId
    }
}

export class MissionTransactionDetail extends TransactionDetail{
    private missionId: string
    constructor(missionId: string){
        super("MissionCompleted")
        this.missionId = missionId
    }
}

export class GameTransactionReason{
    static readonly WIN_PVP_GAME = "WinPVPGame"
    static readonly WIN_PVE_GAME = "WinPVEGame"
    static readonly DEDUCT_TOKEN_TEAM_BATTLE = "DeductTokenTeamBattle"
    static readonly REFUND_TOKEN_TEAM_BATTLE = "RefundTokenTeamBattle"
}