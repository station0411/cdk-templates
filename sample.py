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

# print(len(range(2, 104)), len(alphabet_list[2:]))

result = []
# コマンド一覧（入力禁止） 業務ID①
# for alphabet_holizontal in alphabet_list[2:]:
#     for index_vertical in range(2, 104):
#         result.append(f'=IF(業務ID情報!{alphabet_holizontal}{index_vertical}="〇",業務ID情報!B{index_vertical},"なし")')
#         # print(f'=IF(業務ID情報!{alphabet_holizontal}{index_vertical}="〇",業務ID情報!B{index_vertical},"なし")')

# コマンド一覧（入力禁止） AWSアカウント①
# for index in range(2, 10405+1):
#     result.append(f'=IF(A{index}="なし", "なし", INDEX(業務ID情報!A2:A103, MATCH(A{index}, 業務ID情報!B2:B103, 0)))')
#     # print(f'=IF(A{index}="なし", "なし", INDEX(業務ID情報!A2:A103, MATCH(A{index}, 業務ID情報!B2:B103, 0)))')

# コマンド一覧（入力禁止） 業務ID②
# for alphabet_holizontal in alphabet_list[2:]:
#     for index_vertical in range(2, 104):
#         result.append(f'=IF(業務ID情報!{alphabet_holizontal}{index_vertical}="〇",業務ID情報!{alphabet_holizontal}1,"なし")')
#         # print(f'=IF(業務ID情報!{alphabet_holizontal}{index_vertical}="〇",業務ID情報!{alphabet_holizontal}1,"なし")')

# コマンド一覧（入力禁止） AWSアカウント②
# for index in range(2, 10405+1):
#     result.append(f'=IF(C{index}="なし", "なし", INDEX(業務ID情報!A2:A103, MATCH(C{index}, 業務ID情報!B2:B103, 0)))')
    # print(f'=IF(C{index}="なし", "なし", INDEX(業務ID情報!A2:A103, MATCH(C{index}, 業務ID情報!B2:B103, 0)))')

# コマンド一覧（入力禁止） コマンド有効判定
# for index in range(2, 10405+1):
#     result.append(f'=IF(OR(A{index}="なし", C{index}="なし", AND(A{index}<>"なし", C{index}<>"なし", VALUE(IF(A{index}="なし", 0, A{index}))>=VALUE(IF(C{index}="なし", 0, C{index})))), "無効", "有効")')

# コマンド一覧（入力禁止） S3作成用コマンド
# for index in range(2, 512):
#     print(f'=IF(E{index}="有効", SUBSTITUTE(SUBSTITUTE(バケットポリシー一覧!A2, "XXXXXXXXXXX1", B{index}), "XXXXXXXXXXX2", D{index}), "なし")')

# コマンド一覧（入力禁止） バケットポリシー作成用コマンド
# for index in range(2, 512):
#     print(f'=IF(E{index}="有効", SUBSTITUTE(SUBSTITUTE(バケットポリシー一覧!A3, "XXXXXXXXXXX1", B{index}), "XXXXXXXXXXX2", D{index}), "なし")')


# =OFFSET($C$2,COLUMN()-COLUMN($C$2),ROW()-ROW($C$2))
# result = []
# for index_vertical in range(3):
#     row = "\t".join(str(index_holizontal) for index_holizontal in range(3))
#     result.append(row)

output = "\n".join(result)
# print(output)
with open("./output.txt", "w") as file:
    file.write(output)
