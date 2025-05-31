import os
from selenium import webdriver
from selenium.webdriver.edge.options import Options
from selenium.common.exceptions import WebDriverException

# 读取 uris.md 文件
uris_file_path = 'uris.md'
bad_uris_file_path = 'baduris.md'

# 检查文件是否存在
if not os.path.exists(uris_file_path):
    print(f"{uris_file_path} 文件不存在，请检查路径。")
else:
    print(f"{uris_file_path} 文件存在，开始读取。")

# 存储错误的 URI
bad_uris = []
# 存储所有需要访问的 URI
uris_to_visit = []

try:
    with open(uris_file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        for line in lines:
            try:
                # 移除行首空白
                line = line.lstrip()
                if line.startswith('http'):
                    uri = line
                    uris_to_visit.append(uri)
            except Exception as e:
                print(f"读取 URI 数据时出错，错误行: {line}，错误信息: {e}")
except FileNotFoundError:
    print(f"{uris_file_path} 文件未找到。")
except Exception as e:
    print(f"打开 {uris_file_path} 文件时出错，错误信息: {e}")

# 输出需要访问的 URI 数量
total_uris = len(uris_to_visit)
print(f"需要访问的 URI 数量: {total_uris}")

# 配置 Edge 无头浏览器
edge_options = Options()
edge_options.add_argument('--headless')
# 若 Edge WebDriver 未添加到系统 PATH 环境变量，需指定路径
#driver = webdriver.Edge(executable_path='path/to/msedgedriver.exe', options=edge_options)
driver = webdriver.Edge(options=edge_options)

for index, uri in enumerate(uris_to_visit, start=1):
    try:
        # 使用无头浏览器访问页面
        driver.get(uri.strip())
        print(f"访问 {uri} 成功，进度: {index}/{total_uris}")
    except WebDriverException as e:
        print(f"访问 {uri} 出错: {e}，进度: {index}/{total_uris}")
        bad_uris.append(uri)

# 关闭浏览器
driver.quit()

# 将错误的 URI 写入 baduris.md 文件
if bad_uris:
    try:
        with open(bad_uris_file_path, 'w', encoding='utf-8') as f:
            for uri in bad_uris:
                f.write(f"- {uri}\n")
        print(f"错误的 URI 已写入 {bad_uris_file_path}")
    except Exception as e:
        print(f"写入 {bad_uris_file_path} 文件时出错，错误信息: {e}")
else:
    print("所有 URI 访问正常，没有错误 URI。")