import os

# 获取当前目录
current_dir = os.getcwd()
# 要写入的文件路径
output_file = os.path.join(current_dir, 'urls.md')

# 存储符合条件的文件名称
file_names = []

# 遍历当前目录及其子目录
for root, dirs, files in os.walk(current_dir):
    for file in files:
        if file.lower().endswith(('.html', '.txt')):
            file_path = os.path.join(root, file)
            file_names.append(file_path)

# 写入 urls.md 文件
with open(output_file, 'w', encoding='utf-8') as f:
    f.write("# HTML 和 TXT 文件列表\n\n")
    for file_name in file_names:
        f.write(f"- {file_name}\n")

print(f"文件列表已成功写入 {output_file}")
