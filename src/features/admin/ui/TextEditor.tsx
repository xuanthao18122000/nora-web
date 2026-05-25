"use client";

import { Editor } from "@tinymce/tinymce-react";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { toast } from "sonner";
import { uploadAdminFile } from "@/lib/api/admin";
import { getImageUrl } from "@/lib/utils/image";

// Import TinyMCE & default skin/content (self-hosted, no API key)
import "tinymce/tinymce";
import "tinymce/icons/default";
import "tinymce/themes/silver";
import "tinymce/models/dom";
import "tinymce/skins/ui/oxide/skin.css";
import "tinymce/skins/ui/oxide/content.css";
import "tinymce/skins/content/default/content.css";

// Plugins
import "tinymce/plugins/advlist";
import "tinymce/plugins/autolink";
import "tinymce/plugins/lists";
import "tinymce/plugins/link";
import "tinymce/plugins/image";
import "tinymce/plugins/charmap";
import "tinymce/plugins/preview";
import "tinymce/plugins/anchor";
import "tinymce/plugins/searchreplace";
import "tinymce/plugins/visualblocks";
import "tinymce/plugins/code";
import "tinymce/plugins/fullscreen";
import "tinymce/plugins/insertdatetime";
import "tinymce/plugins/media";
import "tinymce/plugins/table";
import "tinymce/plugins/wordcount";
import "tinymce/plugins/emoticons";
import "tinymce/plugins/emoticons/js/emojis";

type TinyMCEEditor = Parameters<
	NonNullable<React.ComponentProps<typeof Editor>["onInit"]>
>[1];

export interface TextEditorRef {
	getContent: () => string;
	setContent: (content: string) => void;
	focus: () => void;
}

interface TextEditorProps {
	value?: string;
	onChange?: (content: string) => void;
	height?: number;
	placeholder?: string;
	disabled?: boolean;
}

const TOOLBAR =
	"undo redo | blocks fontsize | bold italic underline strikethrough | " +
	"forecolor backcolor removeformat | alignleft aligncenter alignright alignjustify | " +
	"bullist numlist outdent indent | link image media table | " +
	"code preview fullscreen";

export const TextEditor = forwardRef<TextEditorRef, TextEditorProps>(
	function TextEditor(
		{ value, onChange, height = 500, placeholder, disabled = false },
		ref,
	) {
		const editorRef = useRef<TinyMCEEditor | null>(null);

		useImperativeHandle(ref, () => ({
			getContent: () => editorRef.current?.getContent() ?? "",
			setContent: (content: string) => {
				editorRef.current?.setContent(content);
			},
			focus: () => {
				editorRef.current?.focus();
			},
		}));

		const handleImageUpload = (
			blobInfo: { blob: () => Blob; filename: () => string },
			progress: (percent: number) => void,
		): Promise<string> => {
			return new Promise((resolve, reject) => {
				const file = new File([blobInfo.blob()], blobInfo.filename(), {
					type: blobInfo.blob().type,
				});
				progress(0);
				uploadAdminFile(file)
					.then((res) => {
						progress(100);
						resolve(getImageUrl(res.path));
					})
					.catch((err) => {
						toast.error(
							err instanceof Error ? err.message : "Upload thất bại",
						);
						reject({
							message: err?.message || "Upload failed",
							remove: true,
						});
					});
			});
		};

		const handleFilePicker = (
			callback: (
				url: string,
				meta?: { alt?: string; title?: string },
			) => void,
			_value: string,
			meta: { filetype: string },
		) => {
			const input = document.createElement("input");
			input.type = "file";
			if (meta.filetype === "image") input.accept = "image/*";
			else if (meta.filetype === "media") input.accept = "video/*,audio/*";
			else input.accept = "*/*";

			input.onchange = async () => {
				const file = input.files?.[0];
				if (!file) return;
				try {
					const res = await uploadAdminFile(file);
					callback(getImageUrl(res.path), {
						alt: file.name,
						title: file.name,
					});
				} catch (err) {
					toast.error(
						err instanceof Error ? err.message : "Upload thất bại",
					);
				}
			};
			input.click();
		};

		return (
			<Editor
				value={value}
				disabled={disabled}
				onEditorChange={(content) => onChange?.(content)}
				onInit={(_evt, editor) => {
					editorRef.current = editor;
				}}
				licenseKey="gpl"
				init={{
					height,
					menubar: false,
					placeholder,
					// skins/content đã import sẵn ở top-of-file → TinyMCE skip fetch từ CDN
					skin: false,
					content_css: false,
					promotion: false,
					entity_encoding: "raw",
					branding: false,
					plugins: [
						"advlist",
						"autolink",
						"lists",
						"link",
						"image",
						"charmap",
						"preview",
						"anchor",
						"searchreplace",
						"visualblocks",
						"code",
						"fullscreen",
						"insertdatetime",
						"media",
						"table",
						"wordcount",
						"emoticons",
					],
					toolbar: TOOLBAR,
					toolbar_mode: "sliding",
					block_formats:
						"Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; Heading 4=h4; Heading 5=h5; Heading 6=h6; Preformatted=pre",
					fontsize_formats:
						"8px 10px 12px 14px 16px 18px 20px 24px 30px 36px 48px",
					content_style:
						"body { font-family: Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.6; }",
					link_rel_list: [
						{ title: "No Follow", value: "nofollow" },
						{ title: "Sponsored", value: "sponsored" },
						{ title: "UGC", value: "ugc" },
					],
					link_target_list: [
						{ title: "None", value: "" },
						{ title: "Same page", value: "_self" },
						{ title: "New window", value: "_blank" },
					],
					default_link_target: "_blank",
					link_assume_external_targets: true,
					image_title: true,
					image_description: true,
					image_dimensions: true,
					image_advtab: true,
					image_caption: true,
					images_upload_handler: handleImageUpload,
					automatic_uploads: true,
					file_picker_types: "file image media",
				}}
			/>
		);
	},
);
