# Memo

作成手順

1. LINEチャネル作成
2. AWS Lambda作成
3. AWS Gateway作成

## 1. LINEチャネル作成

まずは[LINEDevelopers](https://developers.line.biz/ja/)にログイン

今回は自分のLINEアカウントでログイン
開発者情報を入力し、登録完了

次にLINEBotProviderを作成
今回はProvider名を`astrology`で作成

次はチャネル作成
チャネルには`Create a Messaging API channel`を選択
チャネル名やチャネル説明等を入力し、作成

## 2. AWS Lambda作成

AWSコンソールからLambda画面で作成

今回は関数名`astrology-linebot`、言語はGo1.x系で作成

## 3. AWS Gateway作成

REST API（Privateじゃないほう）を使う
名前等を設定し作成

最初にメソッドを作成、POSTを選択
「Lambda統合プロキシの利用」にチェックを入れて、「Lambda関数」に上記で作成した関数の名前を入力してから保存

次に`メソッドリクエスト`から`HTTPリクエストヘッダー`を選択して追加を押す
`X-Line-Signature` を入力して追加
そして必須ににする

> X-Line-Signatureがリクエストヘッダーに含まれていないリクエストはLINEからのものではないため、受け取る必要がありません。
> なので、APIGateway側であらかじめ弾く設定にしています。

# 4. Go Lambdaテンプレを作成

公式に載っているサンプルをダウンロード

```go:
package main

import (
	"fmt"
	
	"github.com/aws/aws-lambda-go/lambda"
)

type MyEvent struct {
	Name string `json:"What is your name?"`
}

type MyResponse struct {
	Message string `json:"Answer:"`
}

func hello(event MyEvent) (MyResponse, error) {
	return MyResponse{Message: fmt.Sprintf("Hello %s!!", event.Name)}, nil
}

func main() {
	lambda.Start(hello)
}
```

次に公式のSDKをダウンロード

`go get -u github.com/aws/aws-lambda-go/lambda`

そしてビルド

```bash:
GOOS=linux GOARCH=amd64 go build -o main
# GOOS=linux GOARCH=amd64 go build -o [ファイル名]
```

ZIPファイルに固まる

```bash:
zip handler.zip ./main
```


## Golang

> パッケージ管理はgomoduleを使う

https://qiita.com/Syoitu/items/f221b52231703cebe8ff

> LINE Messaging API SDK for Go

https://github.com/line/line-bot-sdk-go


















