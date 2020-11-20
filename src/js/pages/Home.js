import React from 'react';
import MyInfo from "../components/MyInfo";
import Posts from "../components/Posts";
import { Card, CardDeck, Button } from "react-bootstrap";
export default class Home extends React.Component{
    render(){
        return (
            <div>
                <Button variant="secondary" size="lg"> Create new post</Button>
                <MyInfo name="mizuki" bio="情報工学"/>
                    <div className="papers">
                    <CardDeck className = 'm-4' >
                        <Card.Header>読んだ論文
                        <Posts title="a" overview="本物にはエントロピー大、偽物にはエントロピー小にする" link="http://www.aaa" thought="わからんかった、誰か知見ください"/>
                        <Posts title="i" overview="SVMなどのマージン最大、最小化の理論をGANに応用したもの。" link="http://www.iii" thought="これは自分の研究にも応用できそう"/>
                        <Posts title="u" overview="" link="http://www.uuu" thought="GANに３つ目の識別器を導入したのが新規性があると思った"/>
                        <Posts title="e" overview="" link="http://www.eee" thought=""/>
                        </Card.Header>
                        <Card.Header>気になる論文
                        <Posts title="a" overview="本物にはエントロピー大、偽物にはエントロピー小にする" link="http://www.aaa" thought="わからんかった、誰か知見ください"/>
                        <Posts title="i" overview="SVMなどのマージン最大、最小化の理論をGANに応用したもの。" link="http://www.iii" thought="これは自分の研究にも応用できそう"/>
                        <Posts title="u" overview="" link="http://www.uuu" thought="GANに３つ目の識別器を導入したのが新規性があると思った"/>
                        <Posts title="e" overview="" link="http://www.eee" thought=""/>
                        </Card.Header>
                    </CardDeck>
                </div>
            </div>
            
        )
    }
}