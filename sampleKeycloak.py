import requests
from bs4 import BeautifulSoup

LOGIN_PAGE_URL = "http://localhost:8080/realms/master/protocol/saml/clients/aws-saml"
USERNAME = "test-user"
PASSWORD = "password"

def get_saml_assertion(sso_url: str, idp_user: str, idppass: str) -> str:
    print("***getSamlAssertion***")
    get_response = requests.get(sso_url)
    custom_cookie = get_response.headers.get("Set-Cookie", "").split(";")
    root = BeautifulSoup(get_response.text, "html.parser")
    post_url = root.select_one("#kc-form-login")["action"]
    get_inputs = root.select("input")
    form_data = {}
    headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": "; ".join(custom_cookie)
    }
    
    print("***get_response.text***")
    # print(get_response.text)
    print("***cookie***")
    # print(len(custom_cookie))
    # for cookie in custom_cookie:
    #     print(cookie)
    print("***root***")
    # print(root)
    print("***postUrl***")
    # print(get_url)
    print("***get_inputs***")
    for get_input in get_inputs:
        if get_input.get("name") == "username":
            # print(get_input)
            form_data["username"] = USERNAME
        elif get_input.get("name") == "password":
            # print(get_input)
            form_data["password"] = PASSWORD
        else:
            # print(get_input)
            form_data[get_input.get("name")] = get_input.get("value")
    print("***headers***")
    # print(headers)
    
    
    post_response = requests.post(post_url, data=form_data, headers=headers)
    saml_response = BeautifulSoup(post_response.text, "html.parser")
    post_inputs = saml_response.select("input")
    saml_assertion = None
    for post_input in post_inputs:
        if post_input.get("name") == "SAMLResponse":
            saml_assertion = post_input.get("value")
            break
    
    print("***post_response.text***")
    # print(post_response.text)
    print("***post_assertion***")
    print(saml_assertion)
    

get_saml_assertion(LOGIN_PAGE_URL, USERNAME, PASSWORD)