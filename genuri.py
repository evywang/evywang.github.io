import os

# 读取 urls.md 文件
urls_file_path = 'urls.md'
uris_file_path = 'uris.md'

# 存储每个目录下的 txt 和 html 文件
dir_files = {}

with open(urls_file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

for line in lines:
    line = line.strip()
    if line.startswith('-'):
        file_path = line[2:].strip()
        file_dir = os.path.dirname(file_path)
        file_name = os.path.basename(file_path)
        if file_name.lower().endswith('.txt'):
            if file_dir not in dir_files:
                dir_files[file_dir] = {'txt': [], 'html': []}
            dir_files[file_dir]['txt'].append(file_name)
        elif file_name.lower().endswith('.html'):
            if file_dir not in dir_files:
                dir_files[file_dir] = {'txt': [], 'html': []}
            dir_files[file_dir]['html'].append(file_path)

# 构建新的 URI 路径
new_uris = []
for file_dir, files in dir_files.items():
    for txt_file in files['txt']:
        for html_file in files['html']:
            new_uri = f"{html_file}?id={txt_file}"
            new_uris.append(new_uri)

# 将新的 URI 路径写入 uris.md 文件
with open(uris_file_path, 'w', encoding='utf-8') as f:
    for uri in new_uris:
        f.write(f"- {uri}\n")

print(f"新的 URI 路径已成功写入 {uris_file_path}")
