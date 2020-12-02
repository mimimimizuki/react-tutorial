import React from "react";
import Posts from '../components/Posts'
import { Card , Container} from "react-bootstrap";
export default class Favorite extends React.Component{
    render() {
        return (
            <div>
                ここにお気に入りした論文概要を乗せて行く
                <Container className="favorites">
                <div className="favorites">
                    <Posts title="a" overview="本物にはエントロピー大、偽物にはエントロピー小にする" link="http://www.aaa" thought="わからんかった、誰か知見ください" tags={new Array(0)}/>
                    <Posts title="i" overview="SVMなどのマージン最大、最小化の理論をGANに応用したもの。" link="http://www.iii" thought="これは自分の研究にも応用できそう" tags={new Array(0)}/>
                    <Posts title="u" overview="" link="http://www.uuu" thought="GANに３つ目の識別器を導入したのが新規性がある思った" tags={new Array(0)}/>
                    <Posts title="e" overview="" link="http://www.eee" thought="" tags={new Array(0)}/>
                </div>
                </Container>
            </div>
        );
    }
}