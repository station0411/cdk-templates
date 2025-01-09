import string
import json

# AからZまでのアルファベットリストを作成
alphabet_list = list(string.ascii_uppercase)

# AAからCZまでを追加
for first in string.ascii_uppercase:
    for second in string.ascii_uppercase:
        combined = first + second
        alphabet_list.append(combined)
        if combined == "CZ":
            break  # CZまで追加したら終了
    if combined == "CZ":
        break

print(len(range(2, 104)), len(alphabet_list[2:]))

# コマンド一覧（入力禁止） 業務ID①
# for alphabet_holizontal in alphabet_list[2:7]:
#     for index_vertical in range(2, 104):
#         print(f'=IF(業務ID情報!{alphabet_holizontal}{index_vertical}="〇",業務ID情報!B{index_vertical},"なし")')

# コマンド一覧（入力禁止） AWSアカウント①
# for index in range(2, 512):
#     print(f'=IF(A{index}="なし", "なし", INDEX(業務ID情報!A2:A103, MATCH(A{index}, 業務ID情報!B2:B103, 0)))')

# コマンド一覧（入力禁止） 業務ID②
# for alphabet_holizontal in alphabet_list[2:7]:
#     for index_vertical in range(2, 104):
#         print(f'=IF(業務ID情報!{alphabet_holizontal}{index_vertical}="〇",業務ID情報!{alphabet_holizontal}1,"なし")')

# コマンド一覧（入力禁止） AWSアカウント②
# for index in range(2, 512):
#     print(f'=IF(C{index}="なし", "なし", INDEX(業務ID情報!A2:A103, MATCH(C{index}, 業務ID情報!B2:B103, 0)))')

# コマンド一覧（入力禁止） S3作成用コマンド
# for index in range(2, 512):
#     print(f'=IF(E{index}="有効", SUBSTITUTE(SUBSTITUTE(バケットポリシー一覧!A2, "XXXXXXXXXXX1", B{index}), "XXXXXXXXXXX2", D{index}), "なし")')

# コマンド一覧（入力禁止） バケットポリシー作成用コマンド
for index in range(2, 512):
    print(f'=IF(E{index}="有効", SUBSTITUTE(SUBSTITUTE(バケットポリシー一覧!A3, "XXXXXXXXXXX1", B{index}), "XXXXXXXXXXX2", D{index}), "なし")')