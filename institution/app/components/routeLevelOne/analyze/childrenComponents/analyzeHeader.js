import React from 'react';
import {sendAjax} from '../../../../../lib/commonEvent';
let noMarginRight = {
    'marginRight':'0',
    position:'relative',
    overflow:'inherit'
}
const token = sessionStorage.getItem('token');
export default class AnalyzeHeader extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            groupAllItems:[],
            itemName:''
        }
    }
    render(){
        return(
            <div className="operationBar">
                <div className="checkAll">
                    <div className="activeItemsCheckGather" style={{backgroundImage:'none'}}>数据分析</div>
                </div>
                <form style={noMarginRight}>
                    <input type="text" placeholder="请输入关键字" value={this.state.itemName} onChange={this.getNewItem.bind(this)} className="keyWords" onFocus={this.showAllGroupItems.bind(this)} />
                    <ul className="analyzeData">
                        {
                            this.state.groupAllItems.map(function(item,i){
                                return(<li key={i} onClick={this.chooseItem.bind(this,item.id,item.title,item.type)}>{item.title}</li>)
                            }.bind(this))
                        }
                    </ul>
                    <h2 className="search">
                        <img src="img/search.jpg" />
                    </h2>
                </form>
                <div className="clearFloat"></div>
            </div>
        )
    }
    componentWillReceiveProps(nextProps){

    }
    componentDidMount(){
        let self = this;
        window.addEventListener('click',function(event){
            event = event || windoe.event;
            let className = $(event.target).attr('class');
            if(className!='keyWords'){
                $('.analyzeData').hide();
            }
        },false)
        this.getGroupAllItems();
    }
    getGroupAllItems(keyWord){
        let self = this;
        keyWord = keyWord || '';
        sendAjax({
            type:'POST',
            url:'admin/data/findProjectActivity',
            data:{
                token:token,
                search:keyWord
            },
            success:function(data){
                if(data.code==200){
                    let arr = [];
                    if(data.message.project.length>0){
                        $.each(data.message.project,function(index,item){
                            item.type=1;
                            arr.push(item);
                        })

                    }
                    if(data.message.activity.length>0){
                        $.each(data.message.activity,function(index,item){
                            item.type=2;
                            arr.push(item);
                        })

                    }
                    self.setState({
                        groupAllItems:arr
                    })
                }
            }
        })
    }
    //搜索框获取焦点，展示数据
    showAllGroupItems(){
        $('.analyzeData').show();
    }
    //选择数据
    chooseItem(id,title,type){
        this.props.chooseKeyWord(id,title,type)
       this.setState({
           itemName:title
       },function(){
           $('.analyzeData').hide();
       })
    }
    //获取新数据
    getNewItem(event){
        event = event || window.event;
        let keyWord = event.target.value;
        if(keyWord==''){
            this.setState({
                itemName:'',
                groupAllItems:[]
            },function(){
                this.props.chooseKeyWord(-1,'','')
            })
        }else{
            this.setState({
                itemName:keyWord
            },function(){
                this.getGroupAllItems(keyWord);
            })
        }
    }
}
